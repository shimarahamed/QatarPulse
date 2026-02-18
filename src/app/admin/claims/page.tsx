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
import { collection, doc, writeBatch } from 'firebase/firestore';
import type { BusinessClaim } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminClaimsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const claimsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'claims');
  }, [firestore]);

  const { data: claims, isLoading } = useCollection<BusinessClaim>(claimsQuery);

  const handleApprove = async (claim: WithId<BusinessClaim>) => {
    if (!firestore) return;
    setIsUpdating(claim.id);
    try {
      const claimRef = doc(firestore, 'claims', claim.id);
      const businessRef = doc(firestore, 'businesses', claim.businessId);

      const batch = writeBatch(firestore);
      batch.update(claimRef, { status: 'approved' });
      batch.update(businessRef, { ownerId: claim.claimerId });
      await batch.commit();

      toast({
        title: 'Claim Approved',
        description: `${claim.claimerName} is now the owner of ${claim.businessName}.`,
      });
    } catch (error: any) {
      console.error('Error approving claim: ', error);
      toast({
        variant: 'destructive',
        title: 'Approval Failed',
        description: error.message || 'Could not approve the claim.',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleReject = async (claim: WithId<BusinessClaim>) => {
    if (!firestore) return;
    setIsUpdating(claim.id);
    try {
      const claimRef = doc(firestore, 'claims', claim.id);
      const batch = writeBatch(firestore);
      batch.update(claimRef, { status: 'rejected' });
      await batch.commit();

      toast({
        title: 'Claim Rejected',
      });
    } catch (error: any) {
      console.error('Error rejecting claim: ', error);
      toast({
        variant: 'destructive',
        title: 'Rejection Failed',
        description: error.message || 'Could not reject the claim.',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'approved':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Claims</CardTitle>
        <CardDescription>
          Review and manage business ownership claims submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claimer</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead className="hidden md:table-cell">Date Submitted</TableHead>
              <TableHead>Status</TableHead>
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
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            {claims?.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell>
                  <div className="font-medium">{claim.claimerName}</div>
                  <div className="text-sm text-muted-foreground">{claim.claimerEmail}</div>
                </TableCell>
                <TableCell>{claim.businessName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {claim.createdAt ? format(claim.createdAt.toDate(), 'PPP') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(claim.status)}>{claim.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={claim.status !== 'pending' || !!isUpdating}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleApprove(claim)}
                        disabled={isUpdating === claim.id || claim.status !== 'pending'}
                      >
                        {isUpdating === claim.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReject(claim)}
                        disabled={isUpdating === claim.id || claim.status !== 'pending'}
                        className="text-destructive"
                      >
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && claims?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No pending claims found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
