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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [data, setData] = useState({
    email: '',
    id: null,
    role: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    let parsedToken = null;
    if (token) {
      try {
        const payload = token.split('.')[1]; // Get the payload part (middle part of the JWT)
        parsedToken = JSON.parse(atob(payload)); // Decode from Base64 and parse as JSON
        setData({
          email: parsedToken.email,
          id: parsedToken.id,
          role: parsedToken.role
        });
        if (data.role == 'shop_owner') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error decoding the token:', error);
        parsedToken = token;
      }
    } else {
      router.push('/');
    }
  }, []);

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
