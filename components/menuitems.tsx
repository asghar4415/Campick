'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Image from 'next/image';

// Define the type for menu items and cart items
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  shop_name: string;
}

interface CartItem extends MenuItem {
  quantity: number; // Add quantity to CartItem
}

export const MenuDisplay = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    cartItems: CartItem[]; // Update cartItems type to include quantity
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; // Update setCartItems to handle CartItem[]
  }
>(({ cartItems, setCartItems }, ref) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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

  const addToCart = (item: MenuItem) => {
    if (!token) {
      showLoginToast();
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        const updatedItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        console.log('Updated Cart Items:', updatedItems); // Debug log
        return updatedItems;
      }
      const newItems = [...prevItems, { ...item, quantity: 1 }];
      console.log('Updated Cart Items:', newItems); // Debug log
      return newItems;
    });

    toast({
      title: 'Item Added to Cart',
      description: `${item.name} has been added to your cart.`
    });
  };

  useEffect(() => {
    console.log('Updated Cart Items:', cartItems);
  }, [cartItems]);

  const removeFromCart = (item: MenuItem) => {
    if (!token) {
      showLoginToast();
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem?.quantity === 1) {
        return prevItems.filter((i) => i.id !== item.id);
      }
      return prevItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });

    toast({
      title: 'Item Removed from Cart',
      description: `${item.name} has been removed from your cart.`
    });
  };

  return (
    <div ref={ref} className="w-full py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-3xl">Menu Items</h2>
        <br />

        <div className="flex flex-wrap gap-5">
          {menuItems.length === 0 ? (
            <h3 className="text-xl font-semibold text-foreground">
              No menu items available
            </h3>
          ) : (
            menuItems.map((item) => (
              <div
                className="relative flex w-full flex-col gap-2 rounded-md bg-muted p-4 shadow-md md:w-80" // Adjust width and padding
                key={item.id}
              >
                <div className="mb-4 aspect-video rounded-md">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300} // Adjust width to fit better
                      height={200} // Adjust height to match width
                      className="rounded-md"
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  Shop: {item.shop_name}
                </p>
                <p className="text-lg font-semibold">${item.price}</p>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item)}
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
  );
});

MenuDisplay.displayName = 'MenuDisplay';
