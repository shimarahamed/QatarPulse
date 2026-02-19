'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, WithId } from '@/firebase';
import { collection, query, orderBy, doc, serverTimestamp } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Star, MessageSquare, CornerUpRight, Send, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const responseSchema = z.object({
  responseText: z.string().min(1, 'Response cannot be empty.'),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

function OwnerReviewCard({ review }: { review: WithId<Review> }) {
  const [isResponding, setIsResponding] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const params = useParams();
  const businessId = params.businessId as string;

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
  });

  const handleRespond = async (data: ResponseFormValues) => {
    if (!firestore) return;

    const reviewRef = doc(firestore, `businesses/${businessId}/reviews`, review.id);
    const ownerResponse = {
      text: data.responseText,
      respondedAt: serverTimestamp(),
    };

    try {
      updateDocumentNonBlocking(reviewRef, { ownerResponse });
      toast({ title: 'Response Submitted' });
      setIsResponding(false);
      reset();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="space-y-4">
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
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
        </div>
      </div>
      
      {review.ownerResponse ? (
          <div className="ml-10 pl-4 border-l-2 flex gap-4">
            <CornerUpRight className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Response from owner</p>
                    <p className="text-xs text-muted-foreground">
                        {review.ownerResponse.respondedAt ? formatDistanceToNow(review.ownerResponse.respondedAt.toDate(), { addSuffix: true }) : ''}
                    </p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.ownerResponse.text}</p>
                <Button variant="ghost" size="sm" className="h-auto p-1 mt-1 text-xs" onClick={() => setIsResponding(true)}>
                    <Pencil className="h-3 w-3 mr-1"/> Edit Response
                </Button>
            </div>
          </div>
      ) : (
        !isResponding && (
            <div className="ml-14">
                <Button variant="outline" size="sm" onClick={() => setIsResponding(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond
                </Button>
            </div>
        )
      )}

      {isResponding && (
        <form onSubmit={handleSubmit(handleRespond)} className="ml-14 space-y-2">
          <Textarea
            {...register('responseText')}
            placeholder="Write your response..."
            defaultValue={review.ownerResponse?.text}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Send className="h-4 w-4 mr-2"/>}
              {review.ownerResponse ? 'Update Response' : 'Post Response'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsResponding(false)}>Cancel</Button>
          </div>
        </form>
      )}

    </div>
  );
}

export default function ManageReviewsPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const firestore = useFirestore();

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return query(collection(firestore, `businesses/${businessId}/reviews`), orderBy('createdAt', 'desc'));
  }, [firestore, businessId]);

  const { data: reviews, isLoading } = useCollection<Review>(reviewsQuery);
  
  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
        </div>
    );
  }

  return (
    <div>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <OwnerReviewCard review={review} />
              {index < reviews.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground">No reviews yet for this business.</p>
        </div>
      )}
    </div>
  );
}
