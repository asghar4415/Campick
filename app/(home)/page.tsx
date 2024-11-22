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
  const router = useRouter();
  const shopsRef = useRef(null);
  const [loading, setLoading] = useState(true); // Controls loading state
  const [shops, setShops] = useState<Shop[]>([]); // Stores shop data
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null); // Tracks the selected shop

  useEffect(() => {
    // Access localStorage only after the component mounts
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if the token exists
  }, []);

  // Fetch shops data from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllShops`);
        setShops(response.data);
        // console.log('Shops:', response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
      setLoading(false); // Set loading to false after fetching
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
      // console.log('Token:', token);
      if (token) {
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

      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        <CTA1 shopsRef={shopsRef} />

        {/* Shops Section */}
        <div className="w-full pt-20 lg:py-10">
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
            <div className="container mx-auto flex flex-col gap-14">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="font-regular max-w-xl text-3xl tracking-tighter md:text-5xl">
                  Visit Shops
                </h4>
              </div>
              <div className="-mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
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
                        src={demoImg}
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
          )}
        </div>

        {/* Conditionally render menu or prompt */}
        {selectedShop ? (
          <MenuDisplay ref={shopsRef} shop={selectedShop} />
        ) : (
          <div className="flex h-96 w-full items-center justify-center">
            <h3 className="text-xl font-semibold text-foreground">
              Select a shop to view their menu
            </h3>
          </div>
        )}
      </div>
      <Footer1 />
    </div>
  );
}
