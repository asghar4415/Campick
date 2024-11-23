'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { useEffect, useState } from 'react';
import OrderDetailsPage from '../employee-tables';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface OrderDetails {
  order_id: string;
  created_at: string;
  status: string;
  total_price: number;
  payment_status: string;
  user_id: string;
  user_name: string;
  email: string;
}

interface OrderItems {
  id: number;
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  order_id: string;
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/shopdashboard' },
  { title: 'Orders', link: '/shopdashboard/orders' }
];

export default function EmployeeListingPage() {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/listShopOrders`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response.data.orders);
          setOrders(response.data.orders);
          setTotalOrders(response.data.orders.length);
          var orderItems = [];
          for (let i = 0; i < response.data.orders.length; i++) {
            orderItems.push(response.data.orders[i].items);
          }
          setOrderItems(orderItems.flat());
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
        setLoading(false);
      };
      fetchOrders();
    }
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

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Orders (${totalOrders})`}
            description="Manage Orders (Confirm, Reject, Cancel)"
          />
        </div>
        <Separator />
        <OrderDetailsPage
          data={orders}
          totalData={totalOrders}
          orderItems={orderItems}
        />
      </div>
    </PageContainer>
  );
}
