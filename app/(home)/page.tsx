'use client';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { NavigationMenuDemo } from '@/components/navbar';
import { CTA1 } from '@/components/cta';
import { Shops } from '@/components/shopdetails';
import { MenuDisplay } from '@/components/menuitems';
import { useRouter } from 'next/navigation';

import { Footer1 } from '@/components/footer';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState({
    email: '',
    id: null,
    role: ''
  });

  const router = useRouter();
  useEffect(() => {
    async function authenticatiocheck() {
      const token = localStorage.getItem('token');
      let parsedToken = null;

      if (token) {
        try {
          const payload = token.split('.')[1];
          parsedToken = JSON.parse(atob(payload));
          setData({
            email: parsedToken.email,
            id: parsedToken.id,
            role: parsedToken.role
          });
          // console.log('Decoded token:', parsedToken);

          // Handle routing immediately
          if (parsedToken.role == 'shop_owner') {
            router.push('/shopdashboard');
          } else if (
            parsedToken.role == 'student' ||
            parsedToken.role == 'teacher'
          ) {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error decoding the token:', error);
          parsedToken = token;
        }
      } else {
        setIsLoggedIn(false);
      }
    }

    authenticatiocheck();
  }, [router]);

  const shopsRef = useRef(null);

  return (
    <div className="flex min-h-screen flex-col">
      {' '}
      {/* Added min-h-screen */}
      <NavigationMenuDemo isLoggedIn={isLoggedIn} />
      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        {' '}
        <CTA1 shopsRef={shopsRef} />
        <Shops />
        <MenuDisplay ref={shopsRef} />
      </div>
      <Footer1 />
    </div>
  );
}
