import { User } from "firebase/auth";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        setIsAdmin(false);
        setTimeout(() => setIsLoading(false), 100);
        return;
      }

      try {
        const [userResult, adminResult] = await Promise.all([
          user,
          getDoc(doc(db, 'users', user.uid))
        ]);
        
        setUser(userResult);
        setIsAdmin(adminResult.data()?.isAdmin || false);
        setTimeout(() => setIsLoading(false), 100);
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsAdmin(false);
        setTimeout(() => setIsLoading(false), 100);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, isLoading };
}