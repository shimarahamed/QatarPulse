'use client';

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
import { ClipboardList, Loader2 } from 'lucide-react';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  WithId,
} from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { BusinessClaim } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function UserClaimsList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userClaimsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'claims'), where('claimerId', '==', user.uid));
  }, [user, firestore]);

  const { data: claims, isLoading } = useCollection<BusinessClaim>(userClaimsQuery);

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

  if (isUserLoading || isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            Sign In Required
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to see your business claims.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (claims?.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            No Claims Found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You have not submitted any business claims yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead className="hidden md:table-cell">Date Submitted</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims?.map((claim) => (
          <TableRow key={claim.id}>
            <TableCell className="font-medium">{claim.businessName}</TableCell>
            <TableCell className="hidden md:table-cell">
              {claim.createdAt ? format(claim.createdAt.toDate(), 'PPP') : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(claim.status)}>{claim.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function MyClaimsPage() {
  return (
    <div>
      <CardHeader>
        <CardTitle>My Business Claims</CardTitle>
        <CardDescription>
          Here is the status of business ownership claims you've submitted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserClaimsList />
      </CardContent>
    </div>
  );
}
