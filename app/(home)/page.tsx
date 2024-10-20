'use client';

import { useEffect, useState } from 'react';
import { NavigationMenuDemo } from '@/components/navbar';
import { Hero5 } from '@/components/hero';
import { CTA1 } from '@/components/cta';
import { Blog1 } from '@/components/blog1';
import { ShopDisplay } from '@/components/shops';
import { Footer1 } from '@/components/footer';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('token', token);
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {' '}
      {/* Added min-h-screen */}
      <NavigationMenuDemo isLoggedIn={isLoggedIn} />
      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        {' '}
        {/* This should allow overflow */}
        {/* <Hero5 /> */}
        <CTA1 />
        <Blog1 />
        <ShopDisplay />
      </div>
      <Footer1 />
    </div>
  );
}
