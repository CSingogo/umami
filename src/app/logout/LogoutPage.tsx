'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApi } from '@/components/hooks';
import { removeClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';

export function LogoutPage() {
  const router = useRouter();
  const { post } = useApi();

  useEffect(() => {
    async function logout() {
      try {
        await post('/auth/logout');
      } catch {
        // A stale or already-expired session makes this 401. Still leave the page.
      } finally {
        window.location.href = `${process.env.basePath || ''}/login`;
      }
    }

    removeClientAuthToken();
    setUser(null);
    logout();
  }, [router, post]);

  return null;
}
