'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenuDemo } from '@/components/navbar';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  order_id: string;
  date: string;
  total_price: number;
  status: string;
  created_at: string;
  shop_id: string;
}

interface OrderDetails {
  id: number;
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

interface ShopDetails {
  id: string;
  name: string;
  email: string;
  contact_number: string;
}

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingOrderDetails, setFetchingOrderDetails] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserOrders();
    }
  }, [isLoggedIn]);

  const fetchUserOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const { id } = JSON.parse(atob(token.split('.')[1]));
      const response = await axios.get(`${API_URL}/api/listUserOrders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id }
      });

      setUserOrders(response.data.orders || []);
    } catch (error) {
      setUserOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setFetchingOrderDetails(true);
    const { order_id, shop_id } = order;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Fetch shop details
      const shopsResponse = await axios.get(`${API_URL}/api/getAllShops`);
      const shop = shopsResponse.data.find(
        (shop: ShopDetails) => shop.id === shop_id
      );
      setShopDetails(shop);

      // Fetch order details
      const response = await axios.get(
        `${API_URL}/api/orderDetails/${order_id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setOrderDetails(response.data.items || []);
      setIsModalOpen(true);
    } catch (error) {
      toast({ description: 'Failed to fetch order details.' });
    } finally {
      setFetchingOrderDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderDetails([]);
    setShopDetails(null);
  };

  const configureDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavigationMenuDemo
        isLoggedIn={isLoggedIn}
        loading={loading}
        onLogout={() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }}
      />

      <div className="container mx-auto flex-1 px-6 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-800">
            Your Orders
          </h1>
          <p className="text-lg text-gray-500">
            Review your recent orders and track their status.
          </p>
        </div>

        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-500">
              You have no orders at the moment.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userOrders.map((order) => (
              <div
                key={order.order_id}
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-800">
                    Order ID: {order.order_id}
                  </p>
                  <span
                    className={`text-sm font-semibold ${
                      order.status === 'preparing'
                        ? 'text-yellow-500'
                        : order.status === 'accepted'
                        ? 'text-green-500'
                        : order.status === 'rejected'
                        ? 'text-red-500'
                        : order.status === 'delivered'
                        ? 'text-blue-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    <strong>Date:</strong> {configureDate(order.created_at)}
                  </p>
                  <p className="mb-1">
                    <strong>Total:</strong> Rs. {order.total_price}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => viewOrderDetails(order)}
                    variant="default"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {fetchingOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-4 shadow-lg sm:max-w-lg sm:p-6">
            <h2 className="mb-4 text-xl font-bold">Order Details</h2>
            {shopDetails && (
              <div className="mb-4">
                <p>
                  <strong>Shop Name:</strong> {shopDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {shopDetails.email}
                </p>
                <p>
                  <strong>Contact:</strong> {shopDetails.contact_number}
                </p>
              </div>
            )}
            {orderDetails.length > 0 ? (
              <ul>
                {orderDetails.map((item) => (
                  <li
                    key={item.id}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>Item:</strong> {item.item_name}
                    </p>
                    <p>
                      <strong>Price:</strong> Rs. {item.price}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found for this order.</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={closeModal}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
