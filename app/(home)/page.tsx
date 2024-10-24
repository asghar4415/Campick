'use client';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { NavigationMenuDemo } from '@/components/navbar';
import { CTA1 } from '@/components/cta';
import { Blog1 } from '@/components/shopdetails';
import { MenuDisplay } from '@/components/menuitems';
import { Footer1 } from '@/components/footer';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('token', token);
    setIsLoggedIn(!!token);
  }, []);

  const shopsRef = useRef(null);

  return (
    <div className="flex min-h-screen flex-col">
      {' '}
      {/* Added min-h-screen */}
      <NavigationMenuDemo isLoggedIn={isLoggedIn} />
      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        {' '}
        <CTA1 shopsRef={shopsRef} />
        <Blog1 />
        <MenuDisplay ref={shopsRef} />
      </div>
      <Footer1 />
    </div>
  );
}
