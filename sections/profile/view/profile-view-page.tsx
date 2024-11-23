'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import ProfileCreateForm from '../profile-create-form';
import PageContainer from '@/components/layout/page-container';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Profile', link: '/dashboard/profile' }
];

const Loader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
      <h2 className="text-2xl font-semibold">Loading</h2>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex h-screen items-center justify-center">
    <h2 className="text-2xl font-semibold text-red-500">{message}</h2>
  </div>
);

export default function ProfileViewPage() {
  const [data, setData] = useState<{
    id: string | null;
    user_name: string;
    email: string;
    imageURL: string;
  }>({
    id: null,
    user_name: '',
    email: '',
    imageURL: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Redirecting to login...');
        }

        const profileResponse = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(profileResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              'Failed to fetch data. Please try again.'
          );
        } else {
          setError(
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <ProfileCreateForm data={data} />
      </div>
    </PageContainer>
  );
}
