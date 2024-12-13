import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get the user's custom claims
          const idTokenResult = await user.getIdTokenResult(true); // Force token refresh
          console.log('Token claims:', idTokenResult.claims); // Debug log

          // Check admin status from custom claims
          const adminStatus = idTokenResult.claims.admin === true;
          
          // If not in claims, check Firestore as fallback
          if (!adminStatus) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const isFirestoreAdmin = userDoc.data()?.isAdmin === true;
            console.log('Firestore admin status:', isFirestoreAdmin); // Debug log
            setIsAdmin(isFirestoreAdmin);
          } else {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, isLoading };
}