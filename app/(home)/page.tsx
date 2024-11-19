'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationMenuDemo } from '@/components/navbar';
import { CTA1 } from '@/components/cta';
import { Shops } from '@/components/shopdetails';
import { MenuDisplay } from '@/components/menuitems';
import { Footer1 } from '@/components/footer';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  shop_name: string;
  quantity: number;
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const shopsRef = useRef(null);

  useEffect(() => {
    async function authenticatiocheck() {
      const token = localStorage.getItem('token');
      let parsedToken = null;

      if (token) {
        try {
          const payload = token.split('.')[1];
          parsedToken = JSON.parse(atob(payload));

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

    authenticatiocheck();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationMenuDemo isLoggedIn={isLoggedIn} cartItems={cartItems} />

      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        <CTA1 shopsRef={shopsRef} />
        <Shops />
        {/* Pass `cartItems` and `setCartItems` to MenuDisplay */}
        <MenuDisplay
          ref={shopsRef}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>
      <Footer1 />
    </div>
  );
}
