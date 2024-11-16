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
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AddNewMenuItem({ shopId }: { shopId: string }) {
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewMenuItem((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const addNewItem = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token'); // Retrieve token inside the function
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/shop/${shopId}/addMenuItem`,
        newMenuItem,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Menu item added successfully!');
      setNewMenuItem({ name: '', description: '', price: '' });
      window.location.reload();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error adding menu item:', err);
      setError(
        err.response?.data?.message ||
          'Failed to add menu item. Please try again.'
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Items</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Add your new Menu item here. Click "Add" when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newMenuItem.name}
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
              value={newMenuItem.description}
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
              value={newMenuItem.price}
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
                !newMenuItem.name ||
                !newMenuItem.description ||
                !newMenuItem.price
              ) {
                setError('All fields are required.');
                return;
              }
              addNewItem();
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
