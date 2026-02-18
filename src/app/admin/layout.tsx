'use client';

import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    // Wait until we know who the user is and have a firestore instance.
    if (isUserLoading || !firestore) {
      return;
    }

    // If there is no user, they can't be an admin.
    if (!user) {
      setIsAdmin(false);
      setIsCheckingRole(false);
      router.replace('/login');
      return;
    }

    const checkAdminRole = async () => {
      const userProfileRef = doc(firestore, `users/${user.uid}`);
      try {
        const docSnap = await getDoc(userProfileRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have permission to access the admin area.',
          });
          router.replace('/account');
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not verify user permissions.',
        });
        router.replace('/account');
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user, isUserLoading, firestore, router, toast]);

  if (isUserLoading || isCheckingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    // This is a fallback. The useEffect should have already redirected.
    // It prevents a flash of content if the redirect is slow.
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/50">
      <AdminSidebar />
      <div className="md:pl-64">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
