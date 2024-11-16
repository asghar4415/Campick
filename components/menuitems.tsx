'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Image from 'next/image';

export const MenuDisplay = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>((props, ref) => {
  const [menuItems, setMenuItems] = useState<
    Array<{
      name: string;
      description: string;
      price: number;
      image: string;
      shop_name: string;
    }>
  >([]);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getOverAllMenuItems`
        );
        if (response.data.success) {
          setMenuItems(response.data.items || []);
          console.log('Menu Items:', response.data.items);
        } else {
          console.error('Error fetching menu items:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const showLoginToast = () => {
    toast({
      style: {
        backgroundColor: 'black',
        color: 'white'
      },
      title: 'User not logged in',
      description: 'You have to be logged in to perform this action',
      action: (
        <ToastAction
          altText="Go to login page"
          onClick={() => router.push('/signin')}
        >
          Sign in
        </ToastAction>
      )
    });
  };

  const addToCart = (itemName: string) => {
    if (!token) {
      showLoginToast();
      return;
    }
    console.log(`Added ${itemName} to cart`);
  };

  const removeFromCart = (itemName: string) => {
    if (!token) {
      showLoginToast();
      return;
    }
    console.log(`Removed ${itemName} from cart`);
  };

  return (
    <div ref={ref} className="w-full py-10">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-4">
            <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
              Menu Items
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.length === 0 ? (
              <h3 className="text-xl font-semibold text-foreground">
                No menu items available
              </h3>
            ) : (
              menuItems.map((item, index) => (
                <div
                  className="relative flex flex-col gap-2 rounded-md bg-muted p-4 shadow-lg"
                  key={index}
                >
                  <div className="mb-2 aspect-video rounded-md">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={500}
                        height={300}
                        className="rounded-md"
                      />
                    )}
                  </div>
                  <h3 className="text-xl tracking-tight">{item.name}</h3>
                  <p className="text-base text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="text-base text-muted-foreground">
                    Shop: {item.shop_name}
                  </p>
                  <p className="text-base font-semibold">${item.price}</p>

                  {/* Add to Cart / Remove from Cart Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => addToCart(item.name)}
                      className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Adding display name for better debugging
MenuDisplay.displayName = 'MenuDisplay';
