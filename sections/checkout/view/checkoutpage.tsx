'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CartItems from '@/components/cart';
import { NavigationMenuDemo } from '@/components/navbar';

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [totalUniqueItems, setTotalUniqueItems] = useState<number>(0);

  useEffect(() => {
    // Fetch items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setItems(cartItems);

    // Calculate cart total and unique items count
    const total = cartItems.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );
    setCartTotal(total);

    const uniqueItemsCount = cartItems.length;
    setTotalUniqueItems(uniqueItemsCount);

    setLoading(false);
  }, []);

  async function createCheckout(formData: any) {
    setLoading(true);
    const checkedCartTotal = cartTotal; // Use the total calculated above
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationMenuDemo isLoggedIn={true} />
      {loading ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
            <h2 className="text-2xl font-semibold">Loading</h2>
          </div>
        </div>
      ) : (
        <div className="mt-12 flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 lg:flex-row">
          <div className="w-full max-w-3xl flex-1 p-4 ">
            <div className="border-b p-2 text-center">
              <h2 className="text-2xl font-semibold">Cart</h2>
            </div>

            {/* Content scrollable area */}
            <div className="checkout-sidebar-scrollable max-h-[calc(100vh-10rem)] overflow-y-auto p-4">
              {items.length > 0 ? (
                <>
                  <CartItems />
                </>
              ) : (
                !loading && (
                  <h5 className="text-center text-gray-500">
                    No items in cart
                  </h5>
                )
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 space-y-4">
              <Button
                variant="default"
                onClick={createCheckout}
                className="w-full"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  localStorage.setItem('cartItems', JSON.stringify([]));
                  setItems([]);
                }}
                className="w-full"
              >
                🗑️ Empty Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
