'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface OrderDetails {
  order_id: string;
  created_at: string;
  status: string;
  total_price: number;
  payment_status: string;
  user_id: string;
  user_name: string;
  email: string;
}

interface OrderItems {
  id: number;
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  order_id: string;
}

interface CombinedOrderDetails extends OrderDetails {
  items: OrderItems[];
}

export const CellAction: React.FC<{ data: CombinedOrderDetails }> = ({
  data
}) => {
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<
    'order' | 'payment' | 'view' | null
  >(null);
  const [newStatus, setNewStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const { toast } = useToast();

  useEffect(() => {}, [data]);

  const fetchPaymentId = async (order_id: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/getPaymentId/${order_id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      return response.data.paymentInfo.payment_id;
    } catch (error) {
      toast({
        description: 'Error fetching payment ID',
        style: { backgroundColor: 'red', color: 'white' }
      });
      return null;
    }
  };

  const updateOrderStatus = async () => {
    if (!newStatus) return;
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/updateOrderStatus/${data.order_id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      window.location.reload();
      toast({
        description: 'Order status updated successfully',
        style: { backgroundColor: 'green', color: 'white' }
      });
    } catch (error) {
      toast({
        description: 'Error updating order status',
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
    setLoading(false);
    setModalType(null);
  };

  const updatePaymentStatus = async () => {
    if (!paymentStatus) return;
    setLoading(true);
    try {
      const paymentId = await fetchPaymentId(data.order_id);
      if (!paymentId) throw new Error('Invalid payment ID');

      await axios.put(
        `${API_URL}/api/updatePaymentStatus/${paymentId}`,
        {
          paymentId: paymentId,
          status: paymentStatus
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast({
        description: 'Payment status updated successfully',
        style: { backgroundColor: 'green', color: 'white' }
      });
      window.location.reload();
    } catch (error) {
      toast({
        description: 'Error updating payment status',
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
    setLoading(false);
    setModalType(null);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setModalType('payment')}>
            <Edit className="mr-2 h-4 w-4" /> Update Payment Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalType('order')}>
            <Edit className="mr-2 h-4 w-4" /> Update Order Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalType('view')}>
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal Component */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
            {modalType === 'order' && (
              <>
                <h2 className="text-md mb-4 font-semibold">
                  Update Order Status
                </h2>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mb-4 w-full rounded border p-2"
                >
                  <option value="" disabled>
                    {data.status || 'Select order status'}
                  </option>
                  <option value="preparing">Preparing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="delivered">Delivered</option>
                  <option value="discarded">Discarded</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={updateOrderStatus}
                    disabled={!newStatus || loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'payment' && (
              <>
                <h2 className="text-md mb-4 font-semibold">
                  Update Payment Status
                </h2>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="mb-4 w-full rounded border p-2"
                >
                  <option value="" disabled>
                    {data.payment_status || 'Select payment status'}
                  </option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={updatePaymentStatus}
                    disabled={!paymentStatus || loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'view' && (
              <>
                <h2 className="text-center text-lg font-semibold sm:text-left">
                  Order Details
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <strong>Order ID:</strong> {data.order_id}
                  </p>
                  <p>
                    <strong>User Name:</strong> {data.user_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.email}
                  </p>
                  <p>
                    <strong>Total Price:</strong> Rs. {data.total_price}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {data.payment_status}
                  </p>
                  <p>
                    <strong>Order Status:</strong> {data.status}
                  </p>
                  <p>
                    <strong>Order Date & Time:</strong>{' '}
                    {new Date(data.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={closeModal} className="w-full sm:w-auto">
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
