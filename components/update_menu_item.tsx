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
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function UpdateMenuItem({
  shopId,
  menuItem
}: {
  shopId: string;
  menuItem: {
    item_id: string;
    name: string;
    description: string;
    price: string;
  };
}) {
  const [editingMenuItem, setEditingMenuItem] = useState({
    id: menuItem.item_id || '',
    name: menuItem.name || '',
    description: menuItem.description || '',
    price: menuItem.price || ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    setEditingMenuItem({
      id: menuItem.item_id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price
    });
  }, [menuItem]); // Depend on menuItem prop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditingMenuItem((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const updateItem = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token'); // Retrieve token inside the function
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      // console.log('editingMenuItem:', editingMenuItem);
      await axios.put(
        `${API_URL}/api/shop/${shopId}/updateMenuItem/${editingMenuItem.id}`,
        editingMenuItem,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log('response:', response);
      setSuccess('Menu item updated successfully!');

      window.location.reload();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error updating menu item:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update menu item. Please try again.'
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Item</DialogTitle>
          <DialogDescription>
            Update your Menu item details here. Click &quot;Save&quot; when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editingMenuItem.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={editingMenuItem.description}
              onChange={handleChange}
              placeholder="Enter item description"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price Rs.
            </Label>
            <Input
              id="price"
              value={editingMenuItem.price}
              onChange={handleChange}
              placeholder="Enter item price"
              type="number"
              className="col-span-3"
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <DialogFooter>
          <Button
            onClick={() => {
              if (
                !editingMenuItem.name ||
                !editingMenuItem.description ||
                !editingMenuItem.price
              ) {
                setError('All fields are required.');
                return;
              }
              updateItem();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
