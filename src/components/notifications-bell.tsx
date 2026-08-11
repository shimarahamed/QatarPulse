'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  updateDocumentNonBlocking,
  type WithId,
} from '@/firebase';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function NotificationsBell() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [firestore, user]);

  const { data: notifications } = useCollection<Notification>(notificationsQuery);
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const markRead = (notification: WithId<Notification>) => {
    if (!firestore || !user || notification.read) return;
    updateDocumentNonBlocking(
      doc(firestore, 'users', user.uid, 'notifications', notification.id),
      { read: true }
    );
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!notifications || notifications.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const content = (
                <div
                  className={cn(
                    'flex flex-col gap-1 whitespace-normal',
                    !notification.read && 'font-medium'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                    <span className="text-sm">{notification.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {notification.body}
                  </span>
                  {notification.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
                    </span>
                  )}
                </div>
              );

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="items-start py-2"
                  onClick={() => markRead(notification)}
                  asChild={!!notification.href}
                >
                  {notification.href ? (
                    <Link href={notification.href}>{content}</Link>
                  ) : (
                    content
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
