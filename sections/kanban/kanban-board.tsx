'use client';

import { Fragment, useEffect, useState } from 'react';
import NewSectionDialog from './new-section-dialog';
import EditShopDetails from './edit-shop-details';
import shopImg from '@/public/shopimg.avif';
import axios from 'axios';
import { AddNewMenuItem } from '@/components/add_new_item';
import Image from 'next/image';
import { UpdateMenuItem } from '@/components/update_menu_item';
import { DeleteItem } from '@/components/delete_menu_item';
import demoImg from '@/public/demoimg.png';
import { set } from 'date-fns';

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
  item_id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

export function AllShops({ shopExists }: { shopExists: boolean }) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string>('');
  const [shopId, setShopId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchShopData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const shopsResponse = await axios.get(`${API_URL}/api/ownerShops`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const shops = shopsResponse.data.shops;

        if (shops.length > 0) {
          const shopId = shops[0].id;
          setShopId(shopId);

          const shopDetailsResponse = await axios.get(
            `${API_URL}/api/shop/${shopId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          setShopData({
            name: shopDetailsResponse.data.name,
            description: shopDetailsResponse.data.description,
            image_url: shopDetailsResponse.data.image_url || shopImg.src,
            email: shopDetailsResponse.data.contact.email,
            contact_number: shopDetailsResponse.data.contact.contact_number,
            full_name: shopDetailsResponse.data.contact.full_name,
            account_title: shopDetailsResponse.data.contact.account_title,
            payment_method: shopDetailsResponse.data.contact.payment_method,
            payment_details: shopDetailsResponse.data.contact.payment_details
          });

          const menuItemsResponse = await axios.get(
            `${API_URL}/api/shop/${shopId}/getAllMenuItems`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setMenuItems(menuItemsResponse.data.items);
        } else {
          setError('No shops found for this owner.');
        }
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [isMounted]);

  const setImage = (image_url: string) => {
    return image_url || demoImg.src;
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          <h2 className="text-2xl font-semibold">Loading</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {error && <p className="text-red-500">{error}</p>}
      {shopExists ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 ">
          <div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
            <Image
              src={shopData?.image_url || shopImg}
              alt={shopData?.name || 'Shop Image'}
              width={300}
              height={300}
              className="mb-5 rounded-full object-cover"
            />
            <h2 className="mb-2 text-center text-2xl font-bold">
              {shopData?.name}
            </h2>
            <p className="mb-4 text-center text-gray-600">
              {shopData?.description}
            </p>
            <div className="w-full space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Owner:</span>
                <span>{shopData?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{shopData?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact:</span>
                <span>{shopData?.contact_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Title:</span>
                <span>{shopData?.account_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{shopData?.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Details:</span>
                <span>{shopData?.payment_details}</span>
              </div>
            </div>

            {/* Edit Icon */}
            <div className="absolute right-2 top-2">
              <EditShopDetails shopId={shopId} shopData={shopData} />
            </div>
          </div>

          {/* Right Column - Menu Items */}
          <div className="overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">Menu Items</h3>
            {menuItems.length === 0 ? (
              <p className="text-gray-500">No items available in the menu.</p>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 rounded-lg bg-gray-100 p-4 "
                  >
                    <div>
                      <Image
                        src={setImage(item.image_url)}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex w-full items-center justify-between ">
                      <div>
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <p className="text-sm text-green-600">
                          Rs. {item.price}
                        </p>
                      </div>
                      <div className=" flex flex-col gap-2">
                        <UpdateMenuItem shopId={shopId} menuItem={item} />
                        <DeleteItem shopId={shopId} itemId={item.item_id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <AddNewMenuItem shopId={shopId} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 text-center ">
          {/* <p className="text-gray-500">No shops available.</p> */}
          <NewSectionDialog />
        </div>
      )}
    </div>
  );
}
