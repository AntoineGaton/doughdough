"use client";

import { useAdmin } from '@/hooks/useAdmin';

export function AdminPanel() {
  const isAdmin = useAdmin();

  if (!isAdmin) return null;

  return (
    <div>
      <h2>Admin Panel</h2>
      {/* Add admin controls here */}
    </div>
  );
} 