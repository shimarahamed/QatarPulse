'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatDistanceToNow } from 'date-fns';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
  setDocumentNonBlocking,
  WithId,
} from '@/firebase';
import { collection, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { Review } from '@/lib/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ReviewsSectionProps {
  businessId: string;
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required.'),
  text: z.string().min(10, 'Review must be at least 10 characters.').max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

function StarRatingInput({ field }: { field: any }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`cursor-pointer h-7 w-7 transition-colors ${
            star <= (hover || field.value)
              ? 'text-amber-500 fill-amber-500'
              : 'text-muted-foreground'
          }`}
          onClick={() => field.onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: WithId<Review> }) {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={review.userPhotoURL} />
        <AvatarFallback>{review.userDisplayName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{review.userDisplayName}</p>
          <p className="text-xs text-muted-foreground">
            {review.createdAt ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : ''}
          </p>
        </div>
        <div className="flex items-center gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
      </div>
    </div>
  );
}

export default function ReviewsSection({ businessId }: ReviewsSectionProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return query(collection(firestore, `businesses/${businessId}/reviews`), orderBy('createdAt', 'desc'));
  }, [firestore, businessId]);

  const { data: reviews, isLoading } = useCollection<Review>(reviewsQuery);
  
  const hasUserReviewed = user && reviews?.some(review => review.userId === user.uid);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      text: '',
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'You must be signed in to leave a review.',
      });
      return;
    }

    const reviewRef = doc(firestore, `businesses/${businessId}/reviews`, user.uid);
    const newReview = {
      businessId: businessId,
      userId: user.uid,
      userDisplayName: user.displayName || 'Anonymous',
      userPhotoURL: user.photoURL || '',
      rating: values.rating,
      text: values.text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    setDocumentNonBlocking(reviewRef, newReview, { merge: true });

    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback.',
    });
    form.reset();
  };

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Reviews</CardTitle>
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-foreground font-bold text-lg ml-1">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-muted-foreground text-sm">based on {reviews.length} reviews.</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-8">
        {user && !hasUserReviewed && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Rating</FormLabel>
                      <FormControl>
                        <StarRatingInput field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share your experience..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Review
                </Button>
              </form>
            </Form>
          </div>
        )}
        {user && hasUserReviewed && (
            <div className="text-sm text-center text-muted-foreground bg-secondary p-4 rounded-md">
                You've already reviewed this business. You can edit your review from your account page.
            </div>
        )}
        {!user && (
           <div className="text-sm text-center text-muted-foreground bg-secondary p-4 rounded-md">
                Please log in to leave a review.
            </div>
        )}
        
        <Separator />

        <div className="space-y-8">
            {isLoading && (
                <div className="space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}
            {reviews && reviews.length > 0 ? (
                reviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : !isLoading ? (
                <p className="text-muted-foreground text-center">Be the first to review this business!</p>
            ) : null }
        </div>
      </CardContent>
    </Card>
  );
}
