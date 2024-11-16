'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { AllShops } from '../kanban-board';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { set } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Shops', link: '/dashboard/shops' }
];

export default function KanbanViewPage() {
  const [error, setError] = useState('');
  const [shopExists, setShopExists] = useState(false);

  useEffect(() => {
    const fetchShopsdata = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        return;
      }

      try {
        const shopsResponse = await axios.get(`${API_URL}/api/ownerShops`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Shops response:', shopsResponse.data);
        const shops = shopsResponse.data.shops;

        if (shops.length > 0) {
          setShopExists(true);
        } else {
          setError('No shops found for this owner.');
          setShopExists(false);
        }
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
      }
    };
    fetchShopsdata();
  }, []); // Run once when the component mounts

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Shop Details`}
            description="Manage your shop and their menu items."
          />
        </div>
        <br />
        <AllShops shopExists={shopExists} />
      </div>
    </PageContainer>
  );
}
