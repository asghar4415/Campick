'use client';

import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import VerifyEmailModal from '@/components/verify-email-modal';
import jwtDecode from 'jsonwebtoken';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import socket from '@/lib/socket';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/');
        return;
      }

      try {
        const parsedToken: any = jwtDecode.decode(token);
        if (parsedToken?.role !== 'shop_owner') {
          router.push('/');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        router.push('/');
      }
    };

    validateToken();
  }, [router]);

  useEffect(() => {
    setLoading(true);
    const getUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsVerified(data.is_verified);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    getUserData();
  }, []);

  useEffect(() => {
    socket.on('orderCreate', (data) => {
      toast({
        style: { backgroundColor: 'green', color: 'white' },
        title: 'New order received',
        description: `Order ${data.order_id} received.`,
        action: (
          <ToastAction
            altText="Go to Orders"
            onClick={() => router.push('/shopdashboard/orders')}
          >
            View Orders
          </ToastAction>
        )
      });
    });

    return () => {
      socket.off('orderUpdate');
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="relative w-full flex-1">
        {!isVerified && !loading ? <VerifyEmailModal /> : null}
        <Header />
        {children}
      </main>
    </div>
  );
}
