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
import axios from 'axios';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const paymentMethods = ['jazzcash', 'easypaisa', 'sadapay', 'nayapay'];

export default function NewSectionDialog() {
  const [error, setError] = useState('');
  const [newShop, setNewShop] = useState({
    name: '',
    description: '',
    image_url: '',
    email: '',
    contact_number: '',
    full_name: '',
    account_title: '',
    payment_method: '', // Changed to a string to store only one selected method
    payment_details: ''
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      name: e.target.value
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      description: e.target.value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_upload_preset'); // For Cloudinary

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
          formData
        );
        setNewShop((prevShop) => ({
          ...prevShop,
          image_url: response.data.secure_url
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Image upload failed.');
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      email: e.target.value
    }));
  };

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      contact_number: e.target.value
    }));
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      full_name: e.target.value
    }));
  };

  const handleAccountTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      account_title: e.target.value
    }));
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      payment_method: e.target.value
    }));
  };

  const handlePaymentDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      payment_details: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    const shopData = {
      ...newShop
    };

    try {
      const response = await axios.post(`${API_URL}/api/createShop`, shopData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Shop created:', response);
      setNewShop({
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
      setError('');
    } catch (error: any) {
      console.error('Failed to create shop:', error.response?.data);
      setError(
        error.response?.data?.message ||
          'Failed to create shop. Please try again.'
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="w-full">
          ＋ Add New Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Shop</DialogTitle>
          <DialogDescription>Enter the details of the shop</DialogDescription>
        </DialogHeader>
        <form
          id="todo-form"
          className="grid gap-4 py-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              name="name"
              value={newShop.name}
              onChange={handleNameChange}
              placeholder="Shop title..."
              className="col-span-4"
              required
            />
            <Input
              id="description"
              name="description"
              value={newShop.description}
              onChange={handleDescriptionChange}
              placeholder="Shop description..."
              className="col-span-4"
              required
            />
            {/* Image Upload */}
            <div className="col-span-4">
              <label>Upload Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
              onChange={handleEmailChange}
              placeholder="Email..."
              className="col-span-4"
              required
            />
            <Input
              id="contact_number"
              name="contact_number"
              value={newShop.contact_number}
              onChange={handleContactNumberChange}
              placeholder="Contact Number..."
              className="col-span-4"
              required
            />
            <Input
              id="full_name"
              name="full_name"
              value={newShop.full_name}
              onChange={handleFullNameChange}
              placeholder="Full Name..."
              className="col-span-4"
              required
            />
            <Input
              id="account_title"
              name="account_title"
              value={newShop.account_title}
              onChange={handleAccountTitleChange}
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
                        onChange={handlePaymentMethodChange}
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
              onChange={handlePaymentDetailsChange}
              placeholder="Payment Details..."
              className="col-span-4"
            />
          </div>
        </form>
        {error && <div className="text-red-500">{error}</div>}
        <DialogFooter>
          <Button type="submit" size="sm" form="todo-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
