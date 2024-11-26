'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationMenuDemo } from '@/components/navbar';
import { CTA1 } from '@/components/cta';
import { MenuDisplay } from '@/components/menuitems';
import { Footer1 } from '@/components/footer';
import CheckoutSidebar from '@/components/cart-sidebar';
import axios from 'axios';
import Image from 'next/image';
import demoImg from '@/public/demoimg.png';
import socket from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Shop {
  id: string;
  name: string;
  description: string;
  image_url: string;
  contact_number: string;
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks user authentication
  const shopsRef = useRef(null);
  const [loading, setLoading] = useState(true); // Controls loading state
  const [shops, setShops] = useState<Shop[]>([]); // Stores shop data
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null); // Tracks the selected shop

  const router = useRouter();

  const isTokenValid = (token: string) => {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < exp * 1000; // Check if the token is still valid
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };
  const { toast } = useToast();

  useEffect(() => {
    socket.on('orderUpdate', (data) => {
      // console.log('Order update:', data);

      toast({
        style: { backgroundColor: 'green', color: 'white' },
        title: `Your order id:${data.order_id} status Updated to ${data.status}`
      });
    });
  }, []);

  // Fetch shops data from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllShops`);
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
      setLoading(false);
    };

    fetchShops();
  }, []);

  // Handles selecting a shop and updates state
  const handleShopClick = (shop: Shop) => {
    setSelectedShop(shop);
  };

  // Returns the correct image URL or a fallback demo image
  const setImage = (image_url: string) => {
    return image_url || demoImg.src;
  };

  // Checks for authentication token in local storage and decodes user role
  useEffect(() => {
    async function authenticationCheck() {
      const token = localStorage.getItem('token');

      if (token && isTokenValid(token)) {
        try {
          const payload = token.split('.')[1];
          const parsedToken = JSON.parse(atob(payload));

          if (parsedToken.role === 'shop_owner') {
            router.push('/shopdashboard');
          } else if (
            parsedToken.role === 'student' ||
            parsedToken.role === 'teacher'
          ) {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error decoding the token:', error);
        }
      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/'); // Redirect to login if invalid
      }
    }

    authenticationCheck();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar with dynamic login state */}
      <NavigationMenuDemo
        isLoggedIn={isLoggedIn}
        loading={loading}
        onLogout={handleLogout}
      />

      {/* Sidebar for checkout */}
      <CheckoutSidebar />
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
              <h2 className="text-2xl font-semibold">Loading</h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
          <CTA1 isLoggedIn={isLoggedIn} shopsRef={shopsRef} />

          {/* Shops Section */}
          <div className="w-full pt-20 lg:py-10">
            <div className="container mx-auto flex flex-col gap-14">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="max-w-xl text-3xl font-medium tracking-tighter md:text-5xl">
                  Visit Shops
                </h4>
              </div>
              <div className="-mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
                {shops.length === 0 && (
                  <div className="flex w-full">
                    <h3 className="text-xl font-semibold text-foreground">
                      No shops available
                    </h3>
                  </div>
                )}

                {shops.map((shop) => (
                  <div
                    key={shop.id} // Key for rendering efficiency
                    className={`flex cursor-pointer flex-col gap-2 hover:opacity-75 ${
                      selectedShop?.id === shop.id
                    }`}
                    onClick={() => handleShopClick(shop)}
                  >
                    <div className="mb-4 aspect-video rounded-md bg-muted">
                      <Image
                        src={setImage(shop.image_url)}
                        alt={shop.name}
                        width={300}
                        height={200}
                        className="rounded-md"
                      />
                    </div>
                    <h3 className="text-xl tracking-tight">{shop.name}</h3>
                    <p className="text-base text-muted-foreground">
                      {shop.description}
                    </p>
                    <p className="text-base text-muted-foreground">
                      Contact: {shop.contact_number}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conditionally render menu or prompt */}
          {selectedShop ? (
            <MenuDisplay ref={shopsRef} shop={selectedShop} />
          ) : (
            shops.length > 0 && (
              <div className="mt-8 flex w-full items-center justify-center">
                <h3 className="font-semibold text-foreground lg:text-xl">
                  Select a shop to view their menu
                </h3>
              </div>
            )
          )}
        </div>
      )}
      <Footer1 />
    </div>
  );
}
