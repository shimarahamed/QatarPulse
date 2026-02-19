'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { seedDatabase } from '@/lib/seed';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { FirestorePermissionError } from './errors';
import { errorEmitter } from './error-emitter';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const checkAndSeed = async () => {
      // Don't seed if firestore is not available
      if (!firebaseServices.firestore) return;

      // 1. Seed core data if businesses collection is empty
      try {
        const businessesRef = collection(
          firebaseServices.firestore,
          'businesses'
        );
        const q = query(businessesRef, limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log(
            'No businesses found in Firestore. Seeding core database...'
          );
          await seedDatabase(firebaseServices.firestore);
        }
      } catch (e: any) {
        if (e.name === 'FirebaseError' && e.code === 'permission-denied') {
          console.error(
            'Permission denied while checking for businesses. Cannot seed database.'
          );
          const contextualError = new FirestorePermissionError({
            operation: 'list',
            path: 'businesses',
          });
          errorEmitter.emit('permission-error', contextualError);
        } else {
          console.error(
            'An error occurred while checking for businesses:',
            e
          );
        }
      }
    };
    checkAndSeed();
  }, [firebaseServices.firestore]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
