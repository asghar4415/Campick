'use client';

import { useEffect, useState } from 'react';
import { NavigationMenuDemo } from '@/components/navbar';
import { tr } from 'date-fns/locale';
import { Hero5 } from '@/components/hero';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <NavigationMenuDemo isLoggedIn={isLoggedIn} />
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-4xl font-bold">Welcome to CamPick</h1>
        <p className="mt-4 text-lg">Capture the moments that matter most.</p> */}
        <Hero5 />
      </div>
    </div>
  );
}
