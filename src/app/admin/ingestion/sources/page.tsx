'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collection, orderBy, query, serverTimestamp, addDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import type { IngestionSource } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Play, Trash2, Pencil, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { AddSourceDialog } from '@/components/admin/ingestion/add-source-dialog';
import { useToast } from '@/hooks/use-toast';
import { ingestFromSource } from '@/ai/flows/ingest-from-source';

const StatusBadge = ({ status }: { status: IngestionSource['status'] }) => {
  return status === 'active' ? (
    <Badge variant="secondary">Active</Badge>
  ) : (
    <Badge variant="outline">Inactive</Badge>
  );
};

export default function IngestionSourcesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [runningSourceId, setRunningSourceId] = useState<string | null>(null);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const sourcesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ingestion_sources'), orderBy('created_at', 'desc'));
  }, [firestore]);

  const { data: sources, isLoading } = useCollection<IngestionSource>(sourcesQuery);
  
  const handleRunNow = async (source: WithId<IngestionSource>) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Database not available.' });
      return;
    }
    setRunningSourceId(source.id);
    let jobId: string | null = null;
    
    try {
      // 1. Create the job document
      const jobsCollection = collection(firestore, 'ingestion_jobs');
      const jobDocRef = await addDoc(jobsCollection, {
        source_id: source.id,
        source_name: source.name,
        triggered_at: serverTimestamp(),
        triggered_by: 'manual',
        status: 'pending',
      });
      jobId = jobDocRef.id;

      // 2. Update status to running
      await updateDoc(jobDocRef, { status: 'running' });

      // 3. Call the AI flow to fetch and normalize
      const normalizedData = await ingestFromSource({ sourceUrl: source.source_details.url! });

      if (!normalizedData || normalizedData.length === 0) {
        throw new Error("No data returned from the ingestion source.");
      }

      // 4. Save results to pending_businesses
      const batch = writeBatch(firestore);
      const pendingCol = collection(firestore, 'pending_businesses');
      let addedCount = 0;
      normalizedData.forEach(businessData => {
        if (businessData.name_en) { // Basic validation
             const newPendingRef = doc(pendingCol);
             batch.set(newPendingRef, {
                ...businessData,
                submittedBy: 'ingestion-job:' + jobId,
                submittedAt: serverTimestamp(),
                status: 'pending',
            });
            addedCount++;
        }
      });
      await batch.commit();

      // 5. Finalize job status
      await updateDoc(jobDocRef, {
        status: 'completed',
        ended_at: serverTimestamp(),
        summary: {
          records_processed: normalizedData.length,
          records_added: addedCount,
          errors: normalizedData.length - addedCount,
        }
      });
      
      // 6. Update source last_run_at
      await updateDoc(doc(firestore, 'ingestion_sources', source.id), {
        last_run_at: serverTimestamp()
      });

      toast({
        title: 'Job Completed',
        description: `${source.name} finished. ${addedCount} records sent to moderation.`,
      });
      // Optionally redirect or refresh data
      router.push('/admin/ingestion/jobs');

    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Job Failed',
        description: e.message || 'An unexpected error occurred.',
      });
      // If job was created, update its status to failed
      if (jobId) {
        const jobDocRef = doc(firestore, 'ingestion_jobs', jobId);
        await updateDoc(jobDocRef, {
          status: 'failed',
          ended_at: serverTimestamp(),
          summary: { errors: 1, records_processed: 0, records_added: 0 }
        }).catch(console.error); // Best effort to mark as failed
      }
    } finally {
      setRunningSourceId(null);
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ingestion Sources</CardTitle>
            <CardDescription>
              Manage automated data sources for populating the business directory.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              {sources?.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{source.type}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{source.frequency}</TableCell>
                  <TableCell>
                    <StatusBadge status={source.status} />
                  </TableCell>
                  <TableCell>
                    {source.last_run_at
                      ? formatDistanceToNow(source.last_run_at.toDate(), { addSuffix: true })
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!runningSourceId}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRunNow(source)} disabled={runningSourceId === source.id}>
                          {runningSourceId === source.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="mr-2 h-4 w-4" />
                          )}
                          Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && sources?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No data sources created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddSourceDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}
