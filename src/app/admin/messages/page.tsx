'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  updateDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
  type WithId,
} from '@/firebase';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import type { ContactMessage } from '@/lib/types';
import { format } from 'date-fns';
import { CheckCircle2, Mail, MailOpen } from 'lucide-react';

const statusVariant: Record<ContactMessage['status'], 'default' | 'secondary' | 'outline'> = {
  new: 'default',
  read: 'secondary',
  resolved: 'outline',
};

export default function AdminMessagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selected, setSelected] = useState<WithId<ContactMessage> | null>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);

  const openMessage = (message: WithId<ContactMessage>) => {
    setSelected(message);
    if (firestore && message.status === 'new') {
      updateDocumentNonBlocking(doc(firestore, 'contact_messages', message.id), {
        status: 'read',
      });
    }
  };

  const markResolved = () => {
    if (!firestore || !selected) return;
    updateDocumentNonBlocking(doc(firestore, 'contact_messages', selected.id), {
      status: 'resolved',
    });
    toast({ title: 'Marked as resolved' });
    setSelected({ ...selected, status: 'resolved' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>
          Messages submitted through the public contact form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Received</TableHead>
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
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            {messages?.map((message) => (
              <TableRow key={message.id} className={message.status === 'new' ? 'font-medium' : undefined}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {message.status === 'new' ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div>{message.name}</div>
                      <div className="text-sm text-muted-foreground">{message.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {message.createdAt ? format(message.createdAt.toDate(), 'PPP p') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[message.status]}>{message.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => openMessage(message)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && messages?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No messages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
            <DialogDescription>
              From {selected?.name} ({selected?.email})
              {selected?.createdAt ? ` — ${format(selected.createdAt.toDate(), 'PPP p')}` : ''}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm">{selected?.message}</p>
          <DialogFooter>
            <Button variant="outline" asChild>
              <a href={`mailto:${selected?.email}`}>Reply by Email</a>
            </Button>
            {selected?.status !== 'resolved' && (
              <Button onClick={markResolved}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
