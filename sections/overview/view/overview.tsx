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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OverViewPage() {
  const [data, setData] = useState({
    id: null,
    user_name: '',
    email: ''
  });
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    shopDetails: [],
    recentOrders: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const shopsResponse = await axios.get(`${API_URL}/api/ownerShops`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const shops = shopsResponse.data.shops;

        if (shops.length > 0) {
          const shopId = shops[0].id;
          const dashboardResponse = await axios.get(
            `${API_URL}/api/shopDashboard/${shopId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log(dashboardResponse.data);
          setDashboardData({
            revenue: dashboardResponse.data.revenue,
            shopDetails: shops,
            recentOrders: dashboardResponse.data.recentOrders
          });
        } else {
          setError('No shops found for this owner.');
        }
      } catch (error) {
        setError('Failed to fetch dashboard data. Please try again.');
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    async function getShopOwnerData() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData({
          id: response.data.id,
          user_name: response.data.user_name,
          email: response.data.email
        });
      } catch (error) {
        console.error(error);
      }
    }
    getShopOwnerData();
  }, []);

  if (error) {
    return (
      <PageContainer scrollable={true}>
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
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
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
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
