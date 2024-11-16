'use client';

import { Fragment, useEffect, useState } from 'react';
import NewSectionDialog from './new-section-dialog';
import shopImg from '@/public/shopimg.avif';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ShopData {
  name: string;
  description: string;
  image_url: string;
  email: string;
  contact_number: string;
  full_name: string;
  account_title: string;
  payment_method: string;
  payment_details: string;
}

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export function AllShops({ shopExists }: { shopExists: boolean }) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [shopData, setShopData] = useState<ShopData | null>(null); // Initialize as null
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Assuming menu items are in an array
  const [error, setError] = useState<string>('');
  const [shopId, setShopId] = useState<string>('');

  // To set the component as mounted and prevent SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch shop data after the component has mounted to prevent SSR issues
    if (!isMounted) return;

    const fetchShopId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        return;
      }

      try {
        const shopsResponse = await axios.get(`${API_URL}/api/ownerShops`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Shops response:', shopsResponse.data);
        const shops = shopsResponse.data.shops;

        if (shops.length > 0) {
          const shopId = shops[0].id; // Set shopId to the first shop's ID
          setShopId(shopId);
          // Fetch shop details using the shop ID
          const shopDetailsResponse = await axios.get(
            `${API_URL}/api/shop/${shopId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log('Shop Details:', shopDetailsResponse.data);
          setShopData({
            name: shopDetailsResponse.data.name,
            description: shopDetailsResponse.data.description,
            image_url: shopDetailsResponse.data.image_url || shopImg, // Fallback image
            email: shopDetailsResponse.data.contact.email,
            contact_number: shopDetailsResponse.data.contact.contact_number,
            full_name: shopDetailsResponse.data.contact.full_name,
            account_title: shopDetailsResponse.data.contact.account_title,
            payment_method: shopDetailsResponse.data.contact.payment_method,
            payment_details: shopDetailsResponse.data.contact.payment_details
          }); // Set the shop details to state

          // Fetch menu items using the shop ID
          const menuItemsResponse = await axios.get(
            `${API_URL}/api/shop/${shopId}/getAllMenuItems`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log('Menu Items:', menuItemsResponse.data);
          setMenuItems(menuItemsResponse.data.items);
        } else {
          setError('No shops found for this owner.');
        }
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
      }
    };

    fetchShopId();
  }, [isMounted]); // Run only after component is mounted

  if (!isMounted) return null; // Render nothing until mounted

  return (
    <div className="mt-4">
      {error && <p className="text-red-500">{error}</p>}
      {shopExists ? (
        <div className="flex space-x-6">
          {/* Left side - Shop Image and Details */}
          <div className="flex-1">
            <img
              src={shopData?.image_url}
              alt={shopData?.name}
              className="object-fit mb-4 h-64 w-full rounded-lg"
            />
            <h2 className="mb-2 text-2xl font-bold">{shopData?.name}</h2>
            <p className="mb-4 text-gray-600">{shopData?.description}</p>
            <div>
              <p>
                <strong>Owner:</strong> {shopData?.full_name}
              </p>
              <p>
                <strong>Email:</strong> {shopData?.email}
              </p>
              <p>
                <strong>Contact Number:</strong> {shopData?.contact_number}
              </p>
              <p>
                <strong>Account Title:</strong> {shopData?.account_title}
              </p>
              <p>
                <strong>Payment Method:</strong> {shopData?.payment_method}
              </p>
              <p>
                <strong>Payment Details:</strong> {shopData?.payment_details}
              </p>
            </div>
          </div>

          {/* Right side - Menu Items */}
          <div className="flex-1">
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 text-xl font-semibold">Menu Items</h3>
              {menuItems.length === 0 ? (
                <p>No menu items available.</p>
              ) : (
                <div>
                  {menuItems.map((item, index) => (
                    <div key={index} className="border-b py-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p>{item.description}</p>
                      <p>
                        <strong>Price:</strong> ${item.price}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Update and Delete options */}
              <div className="mt-4 flex justify-between">
                <button className="rounded bg-blue-500 px-4 py-2 text-white">
                  Update
                </button>
                <button className="rounded bg-red-500 px-4 py-2 text-white">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p>No shops available.</p>
          <div className="mt-6 w-[300px]">
            <NewSectionDialog />
          </div>
        </>
      )}
    </div>
  );
}
