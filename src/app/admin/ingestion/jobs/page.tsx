'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { IngestionJob } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow, formatDistanceStrict } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const JobStatusBadge = ({ status }: { status: IngestionJob['status'] }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="secondary">
          <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case 'running':
      return (
        <Badge variant="default">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Running
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getDuration = (start?: Date, end?: Date) => {
  if (!start) return 'N/A';
  if (!end) {
    return (
      <span className="text-muted-foreground text-xs">
        {formatDistanceToNow(start, { addSuffix: true })}
      </span>
    );
  }
  return formatDistanceStrict(end, start);
};

export default function IngestionJobsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const jobsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'ingestion_jobs'),
      orderBy('triggered_at', 'desc')
    );
  }, [firestore]);

  const { data: jobs, isLoading } = useCollection<IngestionJob>(jobsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingestion Jobs</CardTitle>
        <CardDescription>
          A log of all data ingestion jobs that have been run, manually or on a
          schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Triggered</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Summary</TableHead>
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
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                </TableRow>
              ))}
            {jobs?.map((job) => (
              <TableRow
                key={job.id}
                onClick={() => router.push(`/admin/ingestion/jobs/${job.id}`)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{job.source_name}</TableCell>
                <TableCell>
                  <JobStatusBadge status={job.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {formatDistanceToNow(job.triggered_at.toDate(), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {job.triggered_by}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getDuration(job.triggered_at?.toDate(), job.ended_at?.toDate())}
                </TableCell>
                <TableCell>
                  {job.status === 'completed' && job.summary ? (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center" title="Processed">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {job.summary.records_processed || 0}
                      </div>
                      <div
                        className="flex items-center text-green-600"
                        title="Added"
                      >
                        +{job.summary.records_added || 0}
                      </div>
                      {(job.summary.errors ?? 0) > 0 && (
                        <div
                          className="flex items-center text-red-600"
                          title="Errors"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {job.summary.errors}
                        </div>
                      )}
                    </div>
                  ) : job.status === 'failed' && job.error ? (
                    <div
                      className="flex items-center text-destructive text-xs"
                      title={job.error}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span className="truncate">{job.error}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && jobs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No jobs have been run yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
