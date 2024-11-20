import React, { useEffect, useState } from 'react';
import demoProduct from '@/public/demoimg.png';

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

const CartItems = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  const updateItemQuantity = (
    item: CartItem,
    action: 'add' | 'reduce',
    value: number
  ) => {
    const updatedItems = items
      .map((cartItem) => {
        if (cartItem.item_id === item.item_id) {
          const newQuantity =
            action === 'add'
              ? cartItem.quantity + value
              : cartItem.quantity - value;

          if (newQuantity <= 0) {
            return null; // Indicating that the item should be removed
          }

          return { ...cartItem, quantity: Math.max(newQuantity, 1) }; // Prevent quantity from going below 1
        }
        return cartItem;
      })
      .filter((item) => item !== null);

    setItems(updatedItems.filter((item) => item !== null) as CartItem[]);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Save updated cart to localStorage
  };

  const cartQuantity = (item: CartItem) => {
    return (
      <div className="flex justify-between">
        <button
          className="rounded-l-md bg-gray-800 p-2 pl-3 pr-3 text-white"
          onClick={() => updateItemQuantity(item, 'reduce', 1)}
        >
          -
        </button>
        <input
          type="text"
          aria-label="Item quantity"
          className="w-full border border-gray-300 p-2 text-center"
          readOnly
          value={item.quantity}
        />
        <button
          className="rounded-r-md bg-gray-800 p-2 pl-3 pr-3 text-white"
          onClick={() => updateItemQuantity(item, 'add', 1)}
        >
          +
        </button>
      </div>
    );
  };

  const productImage = (item: CartItem) => {
    if (item.image_url && item.image_url.length > 0) {
      return (
        <img
          alt={item.name}
          className="h-auto w-full object-cover"
          src={item.image_url}
        />
      );
    }
    return (
      <img
        alt="product"
        className="h-auto w-full object-cover "
        src={demoProduct.src}
      />
    );
  };

  const productVariants = (item: CartItem) => {
    return (
      <div className="mt-2">
        <p className="text-sm text-gray-700">
          <strong>Description:</strong> {item.description}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Shop Name:</strong> {item.shop_name}
        </p>
      </div>
    );
  };

  const totalitems = () => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  const totalPrice = () => {
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  return (
    <>
      <ul className="space-y-4 border-b pb-4">
        {items.map((item, index) => (
          <li className="flex p-4" key={'cartItem-' + index}>
            <div className="w-1/4">{productImage(item)}</div>
            <div className="w-3/4 pl-4">
              <div className="flex items-center justify-between">
                <h6 className="font-semibold">{item.name}</h6>
                <div className="text-right">Rs. {item.price}</div>
              </div>
              <div className="mt-2 ">{cartQuantity(item)}</div>
              {productVariants(item)}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <div className="flex justify-between text-lg font-semibold">
          <div>Total items:</div>
          <div>{totalitems()}</div>
        </div>

        <div className="mt-4 flex justify-between text-lg font-semibold">
          <div>Cart total:</div>
          <div>Rs. {totalPrice()}</div>
        </div>
      </div>
    </>
  );
};

export default CartItems;
