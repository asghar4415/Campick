'use client';

import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // const [shopOwnerLoggedin, setShopOwnerLoggedin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect if no token
      router.push('/');
      return;
    }

    try {
      const payload = token.split('.')[1]; // Extract payload from JWT
      const parsedToken = JSON.parse(atob(payload)); // Decode payload

      if (parsedToken.role === 'shop_owner') {
        console.log('Shop owner logged in');
        // setShopOwnerLoggedin(true);
      } else {
        router.push('/'); // Redirect non-shop owners to home
      }
    } catch (error) {
      console.error('Error decoding the token:', error);
      router.push('/'); // Redirect on error
    }
  }, [router]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
}
