'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';

type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: string;
};

export type Restaurant = {
  id: number;
  name: string;
  description: string | null;
  menuItems: MenuItem[];
};

export function RestaurantDetail({ restaurant }: { restaurant: Restaurant }) {
  useRequireAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [error, setError] = useState('');

  function addToCart(menuItemId: number) {
    setCart((prev) => ({ ...prev, [menuItemId]: (prev[menuItemId] ?? 0) + 1 }));
  }

  function removeFromCart(menuItemId: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (next[menuItemId] > 1) {
        next[menuItemId] -= 1;
      } else {
        delete next[menuItemId];
      }
      return next;
    });
  }

  const cartItems = Object.entries(cart).map(([menuItemId, quantity]) => {
    const menuItem = restaurant.menuItems.find((item) => item.id === Number(menuItemId))!;
    return { menuItem, quantity };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
    0,
  );

  async function placeOrder() {
    setError('');
    if (cartItems.length === 0) {
      setError('Nothing selected');
      return;
    }
    try {
      const response = await api.post('/orders', {
        items: cartItems.map(({ menuItem, quantity }) => ({
          menuItemId: menuItem.id,
          quantity,
        })),
      });
      router.push(`/orders/${response.data.id}`);
    } catch {
      setError('Failed to place order');
    }
  }

  return (
    <main className="p-4">
      <Link href="/restaurants" className="border border-gray-500 px-2 py-1 inline-block">
        Back
      </Link>
      <div className="py-3">{restaurant.name}</div>
      {restaurant.description && <p>{restaurant.description}</p>}

      <ul className="mt-4">
        {restaurant.menuItems.map((item) => (
          <li key={item.id} className="mb-2">
            {item.name} - {item.price}
            <button
              onClick={() => addToCart(item.id)}
              className="border border-gray-500 px-2 py-1 ml-2"
            >
              Add
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 py-3">Cart</div>
      <ul>
        {cartItems.map(({ menuItem, quantity }) => (
          <li key={menuItem.id} className="mb-2">
            {menuItem.name} x {quantity}
            <button
              onClick={() => removeFromCart(menuItem.id)}
              className="border border-gray-500 px-2 py-1 ml-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total: {total}</p>
      {error && <p>{error}</p>}
      <button onClick={placeOrder} className="border border-gray-500 px-2 py-1">
        Place Order
      </button>
    </main>
  );
}
