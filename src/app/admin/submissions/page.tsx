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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import type { Business } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreHorizontal, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSubmissionsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pending_businesses');
  }, [firestore]);

  const { data: submissions, isLoading } = useCollection<Business>(submissionsQuery);

  const handleApprove = async (submission: WithId<Business>) => {
    if (!firestore) return;
    setIsUpdating(submission.id);
    try {
      const batch = writeBatch(firestore);

      // 1. Create a new document in the 'businesses' collection
      const businessRef = doc(collection(firestore, 'businesses'));
      const { submittedAt, submittedBy, ...businessData } = submission;
      const newBusiness = {
        ...businessData,
        slug: submission.name_en.toLowerCase().replace(/\s+/g, '-') || `business-${Date.now()}`,
        status: 'active',
        verified_status: false,
        rating: 0,
        review_count: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      batch.set(businessRef, newBusiness);

      // 2. Delete the document from the 'pending_businesses' collection
      const pendingRef = doc(firestore, 'pending_businesses', submission.id);
      batch.delete(pendingRef);

      await batch.commit();

      toast({
        title: 'Submission Approved',
        description: `${submission.name_en} has been added to the directory.`,
      });
    } catch (error: any) {
      console.error('Error approving submission: ', error);
      toast({
        variant: 'destructive',
        title: 'Approval Failed',
        description: error.message || 'Could not approve the submission.',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleReject = async (submission: WithId<Business>) => {
    if (!firestore) return;
    setIsUpdating(submission.id);
    try {
      const pendingRef = doc(firestore, 'pending_businesses', submission.id);
      const batch = writeBatch(firestore);
      batch.delete(pendingRef);
      await batch.commit();

      toast({
        title: 'Submission Rejected',
      });
    } catch (error: any) {
      console.error('Error rejecting submission: ', error);
      toast({
        variant: 'destructive',
        title: 'Rejection Failed',
        description: error.message || 'Could not reject the submission.',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Submissions</CardTitle>
        <CardDescription>
          Review and moderate new businesses submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="hidden md:table-cell">Date Submitted</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            {submissions?.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="font-medium">{submission.name_en}</div>
                  <div className="text-sm text-muted-foreground">{submission.name_ar}</div>
                </TableCell>
                <TableCell>{submission.address_en}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {submission.submittedAt ? format(submission.submittedAt.toDate(), 'PPP') : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(submission)}
                        disabled={isUpdating === submission.id}
                        >
                        {isUpdating === submission.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        <span className="ml-2 hidden sm:inline">Approve</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(submission)}
                        disabled={isUpdating === submission.id}
                        >
                        <X className="h-4 w-4" />
                         <span className="ml-2 hidden sm:inline">Reject</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && submissions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No pending submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
