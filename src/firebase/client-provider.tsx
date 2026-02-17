'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { seedDatabase } from '@/lib/seed';
import { collection, query, limit, getDocs } from 'firebase/firestore';

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

      const categoriesRef = collection(
        firebaseServices.firestore,
        'categories'
      );
      // A query to check if at least one document exists.
      const q = query(categoriesRef, limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(
          'No categories found in Firestore. Seeding database with mock data...'
        );
        try {
          await seedDatabase(firebaseServices.firestore);
          console.log('Database seeding complete.');
        } catch (error) {
          console.error('Database seeding failed:', error);
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
