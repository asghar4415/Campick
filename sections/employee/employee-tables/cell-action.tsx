'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

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

// Define the combined type
interface CombinedOrderDetails extends OrderDetails {
  items: OrderItems[]; // Add 'items' property to OrderDetails
}

export const CellAction: React.FC<{
  data: CombinedOrderDetails;
}> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>(''); // Track new status for the order
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] =
    useState<CombinedOrderDetails | null>(null);
  const [orders, setOrders] = useState<CombinedOrderDetails[]>([]);

  const { toast } = useToast();

  // useEffect(() => {
  //   const socket = io(API_URL, {
  //     transports: ['polling'], // Ensure WebSocket transport is used
  //   });

  //   socket.on('connect', () => {
  //   });

  //   socket.on("newOrder", (newOrder) => {
  //     setOrders((prevOrders) => [newOrder, ...prevOrders]);
  //     toast({
  //       style: { backgroundColor: 'green', color: 'white' },
  //       title: 'New order received',
  //       description: `Order ${newOrder.order_id} received from ${newOrder.user_name}`,
  //     });
  //   });

  //   socket.on("orderUpdate", (updatedOrder) => {
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.order_id === updatedOrder.order_id ? updatedOrder : order
  //       )
  //     );
  //     if (selectedOrder && selectedOrder.order_id === updatedOrder.order_id) {
  //       setSelectedOrder(updatedOrder);
  //     }
  //     toast({
  //       style: { backgroundColor: 'green', color: 'white' },
  //       title: 'Order updated',
  //       description: `Order ${updatedOrder.order_id} status updated to ${updatedOrder.status}`,
  //     });
  //   });

  //   socket.on('disconnect', () => {
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [selectedOrder]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const fetchPaymentId = async (order_id: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/getPaymentId/${order_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data.paymentInfo.payment_id;
    } catch (error) {
      console.error(error);
    }
  };

  const updatePaymentandOrderStatus = async (
    order_id: string,
    newStatus: string,
    paymentStatus: string
  ) => {
    setLoading(true);
    try {
      const updatingResponse = await axios.put(
        `${API_URL}/api/updateOrderStatus/${order_id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setOrderStatus(newStatus);

      // Update payment status
      const paymentId = await fetchPaymentId(order_id);

      const paymentResponse = await axios.put(
        `${API_URL}/api/updatePaymentStatus/${paymentId}`,
        {
          paymentId: paymentId,
          status: paymentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    closeModal();
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

          <DropdownMenuItem onClick={openModal}>
            <Edit className="mr-2 h-4 w-4" /> Update Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal for updating order status */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
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

            <h2 className="text-md mb-4 mt-4 font-semibold">
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
                onClick={() => {
                  updatePaymentandOrderStatus(
                    data.order_id,
                    newStatus,
                    paymentStatus
                  );
                }}
                disabled={!newStatus || !paymentStatus || loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
