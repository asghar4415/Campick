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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const shopsRef = useRef(null);

  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null); // State to hold the selected shop

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllShops`);
        setShops(response.data);
        console.log('Shops:', response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  const setImage = (image_url: string) => {
    if (image_url) {
      return image_url;
    }
    return demoImg.src;
  };

  const handleShopClick = (shop: Shop) => {
    setSelectedShop(shop); // Set the selected shop
  };

  useEffect(() => {
    async function authenticationCheck() {
      const token = localStorage.getItem('token');

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
      } else {
        setIsLoggedIn(false);
      }
    }

    authenticationCheck();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationMenuDemo isLoggedIn={isLoggedIn} />
      <CheckoutSidebar />
      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        <CTA1 shopsRef={shopsRef} />

        {/* Shops Section */}
        <div className="w-full pt-20 lg:py-10">
          <div className="container mx-auto flex flex-col gap-14">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-regular max-w-xl text-3xl tracking-tighter md:text-5xl">
                Visit Shops
              </h4>
            </div>
            <div className="-mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
              {shops.map((shop) => (
                <div
                  key={shop.id} // Key should be on the outermost element
                  className="flex cursor-pointer flex-col gap-2 hover:opacity-75"
                  onClick={() => handleShopClick(shop)} // Pass shop to the handler
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

        {selectedShop && <MenuDisplay ref={shopsRef} shop={selectedShop} />}
        {!selectedShop && (
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
