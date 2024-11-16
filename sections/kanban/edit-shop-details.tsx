'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const paymentMethods = ['jazzcash', 'easypaisa', 'sadapay', 'nayapay'];

export default function EditShopDetails({
  shopId,
  shopData
}: {
  shopId: string;
  shopData: {
    name: string;
    description: string;
    image_url: string;
    email: string;
    contact_number: string;
    full_name: string;
    account_title: string;
    payment_method: string;
    payment_details: string;
  } | null;
}) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newShop, setNewShop] = useState({
    name: '',
    description: '',
    image_url: '',
    email: '',
    contact_number: '',
    full_name: '',
    account_title: '',
    payment_method: '',
    payment_details: ''
  });

  // Effect to initialize newShop only if shopData changes or is provided
  useEffect(() => {
    if (shopData && shopData.name !== newShop.name) {
      setNewShop(shopData);
    }
  }, [shopData]); // No need to depend on newShop here

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShop((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewShop((prev) => ({
          ...prev,
          image_url: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditShopDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/updateshop/${shopId}`,
        newShop,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log('Edit shop details response:', response.data);

      setSuccess('Shop details updated successfully.');
      window.location.reload();
    } catch (error) {
      setError('Failed to update shop details. Please try again.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-gray-500 hover:text-blue-500"
          title="Edit Shop Details"
          aria-label="Edit Shop"
        >
          <FaEdit size={21} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shop Details</DialogTitle>
          <DialogDescription>Edit the details of the shop</DialogDescription>
        </DialogHeader>
        <form
          id="edit-shop-form"
          className="grid gap-4 py-4"
          onSubmit={handleEditShopDetails}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              name="name"
              value={newShop.name}
              onChange={handleChange}
              placeholder="Shop title..."
              className="col-span-4"
              required
            />
            <Input
              id="description"
              name="description"
              value={newShop.description}
              onChange={handleChange}
              placeholder="Shop description..."
              className="col-span-4"
              required
            />
            <div className="col-span-4">
              <label>Upload Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="col-span-4"
              />
              {newShop.image_url && (
                <div className="mt-2">
                  <img
                    src={newShop.image_url}
                    alt="Selected"
                    className="h-auto w-full"
                  />
                </div>
              )}
            </div>
            <Input
              id="email"
              name="email"
              value={newShop.email}
              onChange={handleChange}
              placeholder="Email..."
              className="col-span-4"
              required
            />
            <Input
              id="contact_number"
              name="contact_number"
              value={newShop.contact_number}
              onChange={handleChange}
              placeholder="Contact Number..."
              className="col-span-4"
              required
            />
            <Input
              id="full_name"
              name="full_name"
              value={newShop.full_name}
              onChange={handleChange}
              placeholder="Full Name..."
              className="col-span-4"
              required
            />
            <Input
              id="account_title"
              name="account_title"
              value={newShop.account_title}
              onChange={handleChange}
              placeholder="Account Title..."
              className="col-span-4"
            />
            <div className="col-span-4">
              <label>Select Payment Method</label>
              <div className="flex gap-4">
                {paymentMethods.map((method) => (
                  <div key={method}>
                    <label>
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={newShop.payment_method === method}
                        onChange={handleChange}
                      />
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Input
              id="payment_details"
              name="payment_details"
              value={newShop.payment_details}
              onChange={handleChange}
              placeholder="Payment Details..."
              className="col-span-4"
            />
          </div>
        </form>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <DialogFooter>
          <Button type="submit" size="sm" form="edit-shop-form">
            Edit Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}