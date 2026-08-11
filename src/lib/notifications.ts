import { collection, serverTimestamp, type Firestore } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase';
import type { NotificationType } from '@/lib/types';

interface NotifyUserInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
}

/** Creates an in-app notification for a user (shown in the header bell dropdown). */
export function notifyUser(firestore: Firestore, { userId, type, title, body, href }: NotifyUserInput) {
  const notificationsRef = collection(firestore, 'users', userId, 'notifications');
  addDocumentNonBlocking(notificationsRef, {
    userId,
    type,
    title,
    body,
    href: href ?? null,
    read: false,
    createdAt: serverTimestamp(),
  });
}
