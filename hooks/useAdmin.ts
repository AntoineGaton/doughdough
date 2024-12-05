import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(!!token.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  return isAdmin;
} 