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
    payment_method: '',
    payment_details: ''
  });
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUserVerification = async () => {
    setLoading(true);

    // Adding a delay of 1-2 seconds
    setTimeout(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.is_verified) {
          setIsVerified(true);
          setError('');
        } else {
          setError('Please verify your account first.');
        }
      } catch (err) {
        // console.error('Error verifying user:', err);
        setError('Failed to verify user.');
      } finally {
        setLoading(false);
      }
    }, 1000); // 1000ms delay (1 second)
  };

  const handleInputChange = (field: string, value: string) => {
    setNewShop((prevShop) => ({
      ...prevShop,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/createShop`, newShop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      window.location.reload();
      setError('');
    } catch (err: any) {
      // console.error('Failed to create shop:', err.response?.data);
      setError(
        err.response?.data?.message ||
          'Failed to create shop. Please try again.'
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={checkUserVerification}
        >
          {loading ? 'Loading...' : '＋ Add New Shop'}
        </Button>
      </DialogTrigger>
      {isVerified ? (
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
            <DialogDescription>Enter the details of the shop</DialogDescription>
          </DialogHeader>
          <form
            id="shop-form"
            className="grid gap-4 py-4"
            onSubmit={handleSubmit}
          >
            <Input
              id="name"
              value={newShop.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Shop Name..."
              required
            />
            <Input
              id="description"
              value={newShop.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Shop Description..."
              required
            />
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('upload_preset', 'your_upload_preset');

                  try {
                    const response = await axios.post(
                      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
                      formData
                    );
                    handleInputChange('image_url', response.data.secure_url);
                  } catch {
                    setError('Image upload failed.');
                  }
                }
              }}
            />
            <Input
              id="email"
              value={newShop.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email..."
              required
            />
            <Input
              id="contact_number"
              value={newShop.contact_number}
              onChange={(e) =>
                handleInputChange('contact_number', e.target.value)
              }
              placeholder="Contact Number..."
              required
            />
            <Input
              id="full_name"
              value={newShop.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Full Name..."
              required
            />
            <Input
              id="account_title"
              value={newShop.account_title}
              onChange={(e) =>
                handleInputChange('account_title', e.target.value)
              }
              placeholder="Account Title..."
            />
            <div>
              <label>Select Payment Method:</label>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <label key={method} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="payment_method"
                      value={method}
                      checked={newShop.payment_method === method}
                      onChange={(e) =>
                        handleInputChange('payment_method', e.target.value)
                      }
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
            <Input
              id="payment_details"
              value={newShop.payment_details}
              onChange={(e) =>
                handleInputChange('payment_details', e.target.value)
              }
              placeholder="Payment Details..."
            />
          </form>
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" size="sm" form="shop-form">
              Add Shop
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Required</DialogTitle>
          </DialogHeader>
          <p className="text-red-500">{error}</p>
        </DialogContent>
      )}
    </Dialog>
  );
}
