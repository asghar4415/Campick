'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CartItems from '@/components/cart';
import { NavigationMenuDemo } from '@/components/navbar';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CartItem {
  name: string;
  item_id: string;
  quantity: number;
  description: string;
  price: number;
  shop_name: string;
  shop_id: string;
  image_url: string;
}

interface ShopPaymentDetails {
  type: string;
  details: string[];
}

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [totalUniqueItems, setTotalUniqueItems] = useState<number>(0);
  const [shopPaymentDetails, setShopPaymentDetails] =
    useState<ShopPaymentDetails>({
      type: '',
      details: []
    });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const { toast } = useToast();
  const Router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Router.push('/');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setItems(cartItems);

    const total = cartItems.reduce(
      (acc: number, item: CartItem) => acc + item.price * item.quantity,
      0
    );
    setCartTotal(total);

    setTotalUniqueItems(cartItems.length);
    setLoading(false);
  }, []);

  const fetchShopPaymentDetails = async (shopId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/${shopId}/payment-details`
      );
      setShopPaymentDetails(response.data.methods[0]);
    } catch (error) {}
  };

  useEffect(() => {
    if (items.length > 0) {
      fetchShopPaymentDetails(items[0].shop_id);
    }
  }, [items]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const response = await axios.post(`${API_URL}/api/imageupload`, formData);
      setUploadedImage(response.data.data);
    } catch (error) {
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setVerifying(true);
    if (!uploadedImage) {
      toast({
        title: 'Error',
        description: 'Please upload a payment screenshot',
        style: { backgroundColor: 'red', color: 'white' }
      });
      return;
    }

    const PaymentData = {
      payment_screenshot_url: uploadedImage.url,
      shop_id: items[0].shop_id,
      amount: cartTotal,
      payment_method: shopPaymentDetails.type,
      items: items
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/verifyPaymentAndCreateOrder`,
        PaymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 'success') {
        toast({
          title: 'Payment Verified and order placed',
          // description: 'Your payment has been verified successfully',
          style: { backgroundColor: 'green', color: 'white' }
        });
        localStorage.setItem('cartItems', JSON.stringify([]));
        setItems([]);
        setCartTotal(0);
        setTotalUniqueItems(0);
        setModalVisible(false);
      } else {
        toast({
          title: 'Payment Failed',
          description: 'Verification failed. Please try again.',
          style: { backgroundColor: 'red', color: 'white' }
        });
      }
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    Router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationMenuDemo
        isLoggedIn={isLoggedIn}
        loading={loading}
        onLogout={handleLogout}
      />
      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
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
                  <CartItems items={items} />
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
                  disabled={items.length === 0}
                  onClick={() => {
                    setUploadedImage(null);
                    setError(null);
                    setModalVisible(true);
                  }}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem('cartItems', JSON.stringify([]));
                    setItems([]); // Empty cart on click
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

      {/* Modal for Payment Proof */}
      {/* Modal for Payment Proof */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="text-center text-xl font-semibold">
              Verify Payment
            </h3>

            {/* Scrollable content section */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <p className="pt-1 text-sm">
                <strong>Payment Method:</strong> {shopPaymentDetails.type}
              </p>
              <p className="pt-1 text-sm">
                <strong>Full Name:</strong> {shopPaymentDetails.details[0]}
              </p>
              <p className="pt-1 text-sm">
                <strong>Account Number:</strong> {shopPaymentDetails.details[1]}
              </p>
              <p className="pt-1 text-sm">
                <strong>Contact Number:</strong> {shopPaymentDetails.details[2]}
              </p>
              <br />
              <p>
                <strong>Total Amount:</strong> Rs. {cartTotal}
              </p>

              {/* Upload payment proof */}
              <div className="mt-4">
                <label className="mb-2 block text-sm">
                  Upload Payment Proof
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                {uploadedImage && !isUploading ? (
                  <div className="mb-4">
                    <img
                      src={uploadedImage.url}
                      alt="Payment Screenshot"
                      className="w-40 rounded-lg"
                    />
                  </div>
                ) : isUploading ? (
                  <div className="mb-4 mt-5 items-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
                  </div>
                ) : null}
              </div>
            </div>

            <p className="text-sm text-red-500">{error}</p>

            {/* Buttons */}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={!uploadedImage || isUploading || verifying}
              >
                {verifying ? 'Verifying...' : 'Verify Payment'}
              </Button>
            </div>

            {/* Close button for the modal */}
            <button
              onClick={() => setModalVisible(false)}
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
