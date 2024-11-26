'use client';

import { BarGraph } from '../bar-graph';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '../recent-sales';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { set } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Recentsales {
  email: string;
  user_name: string;
  total_price: number;
}

export default function OverViewPage() {
  const [data, setData] = useState({
    id: null,
    user_name: '',
    email: ''
  });
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    shopDetails: []
  });
  const [recentOrders, setRecentOrders] = useState<Recentsales[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        // Fetch shops
        const shopsResponse = await axios.get(`${API_URL}/api/ownerShops`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const shops = shopsResponse.data.shops;

        if (shops.length > 0) {
          const shopId = shops[0].id;

          // Fetch dashboard data
          const dashboardResponse = await axios.get(
            `${API_URL}/api/shopDashboard/${shopId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          const deliveredOrders = dashboardResponse.data.recentOrders.filter(
            (order: any) => order.status === 'delivered'
          );

          setDashboardData({
            revenue: dashboardResponse.data.revenue,
            shopDetails: shops
          });

          setRecentOrders(deliveredOrders);
        } else {
          setError('No shops found for this owner.');
          setRecentOrders([]);
        }

        // Fetch profile data
        const profileResponse = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setData({
          id: profileResponse.data.id,
          user_name: profileResponse.data.user_name,
          email: profileResponse.data.email
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          <h2 className="text-2xl font-semibold">Loading</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, {data.user_name || 'User'}
          </h2>
        </div>
        <div className="flex h-screen items-center justify-center">
          <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, {data.user_name}
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs. {dashboardData.revenue}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{recentOrders.length}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made {recentOrders.length} sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales recentOrders={recentOrders} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
