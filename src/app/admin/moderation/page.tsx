'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collectionGroup, doc, query, where, updateDoc } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, ThumbsDown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminModerationPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const pendingReviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collectionGroup(firestore, 'reviews'), where('status', '==', 'pending'));
  }, [firestore]);

  const { data: reviews, isLoading } = useCollection<Review>(pendingReviewsQuery);

  const handleUpdateStatus = async (review: WithId<Review>, status: 'approved' | 'rejected') => {
    if (!firestore) return;
    setIsUpdating(review.id);
    try {
      const reviewRef = doc(firestore, 'businesses', review.businessId, 'reviews', review.id);
      await updateDoc(reviewRef, { status: status });
      toast({
        title: `Review ${status}`,
        description: `The review for ${review.businessName} has been ${status}.`,
      });
    } catch (error: any) {
      console.error('Error updating review status: ', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update the review status.',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
        <CardDescription>
          Review and approve or reject user-submitted reviews.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business & Review</TableHead>
              <TableHead className="hidden md:table-cell">User</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <Link className="font-medium hover:underline" href={`/b/${review.businessId}`} target="_blank">
                      {review.businessName || 'Unknown Business'}
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{review.text}</p>
                  </div>
                </TableCell>
                 <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                        <span className="font-medium">{review.userDisplayName}</span>
                        <span className="text-xs text-muted-foreground">{review.userId}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {review.createdAt ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(review, 'approved')}
                        disabled={isUpdating === review.id}
                        >
                        <Check className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Approve</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(review, 'rejected')}
                        disabled={isUpdating === review.id}
                        >
                        <ThumbsDown className="h-4 w-4" />
                         <span className="ml-2 hidden sm:inline">Reject</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && reviews?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No pending reviews to moderate.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
