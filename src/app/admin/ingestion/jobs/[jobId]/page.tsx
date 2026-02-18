'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  useFirestore,
  useDoc,
  useCollection,
  useMemoFirebase,
  WithId,
} from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import type { IngestionJob, Business } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow, formatDistanceStrict } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';


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


function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    const firestore = useFirestore();

    const jobRef = useMemoFirebase(() => {
        if (!firestore || !jobId) return null;
        return doc(firestore, 'ingestion_jobs', jobId);
    }, [firestore, jobId]);
    const { data: job, isLoading: isLoadingJob } = useDoc<IngestionJob>(jobRef);

    const pendingBusinessesQuery = useMemoFirebase(() => {
        if (!firestore || !jobId) return null;
        return query(collection(firestore, 'pending_businesses'), where('submittedBy', '==', `ingestion-job:${jobId}`));
    }, [firestore, jobId]);

    const { data: pendingBusinesses, isLoading: isLoadingBusinesses } = useCollection<Business>(pendingBusinessesQuery);

    if (isLoadingJob) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold">Job Not Found</h2>
                <p className="text-muted-foreground">The job you are looking for does not exist.</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        )
    }
    
    const getDuration = (start?: Date, end?: Date) => {
        if (!start) return 'N/A';
        if (!end) return formatDistanceToNow(start);
        return formatDistanceStrict(end, start);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-headline">Job Details</h1>
                    <p className="text-sm text-muted-foreground break-all">{job.id}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <p className="text-muted-foreground">Source</p>
                            <p className="font-medium">{job.source_name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Status</p>
                            <JobStatusBadge status={job.status} />
                        </div>
                        <div>
                            <p className="text-muted-foreground">Triggered</p>
                            <p className="font-medium">{format(job.triggered_at.toDate(), 'PPP p')}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{getDuration(job.triggered_at?.toDate(), job.ended_at?.toDate())}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {job.status === 'failed' && job.error && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <XCircle />
                            Error Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="p-4 bg-muted rounded-md text-sm text-foreground overflow-x-auto whitespace-pre-wrap">
                            {job.error}
                        </pre>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                     <CardTitle>Processed Businesses</CardTitle>
                     <CardDescription>
                        {`This job processed ${job.summary?.records_processed || 0} records and created ${job.summary?.records_added || 0} pending submissions.`}
                     </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingBusinesses ? (
                        <div className="space-y-2">
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                        </div>
                    ) : pendingBusinesses && pendingBusinesses.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full space-y-1">
                            {pendingBusinesses.map(biz => (
                                <AccordionItem value={biz.id} key={biz.id} className="border rounded-md px-4">
                                    <AccordionTrigger>
                                        <div className="flex flex-col text-left">
                                            <p className="font-medium">{biz.name_en || 'Unnamed Business'}</p>
                                            <p className="text-sm text-muted-foreground">{biz.address_en || 'No address'}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="p-4 bg-muted rounded-md text-sm text-foreground overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(biz, null, 2)}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No businesses were added by this job.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default JobDetailsPage;
