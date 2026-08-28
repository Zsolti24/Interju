'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { LogoutButton } from '@/components/LogoutButton';

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
    <main className="mx-auto max-w-2xl p-6">
      <Link
        href="/restaurants"
        className="inline-block rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
      >
        Back
      </Link>

      <h1 className="mt-4 text-xl font-semibold">{restaurant.name}</h1>
      {restaurant.description && (
        <p className="text-sm text-gray-600">{restaurant.description}</p>
      )}

      <h2 className="mt-6 mb-2 text-lg font-semibold">Menu</h2>
      <ul className="flex flex-col gap-2">
        {restaurant.menuItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white p-3"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              {item.description && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
              <p className="text-sm text-gray-600">{item.price}</p>
            </div>
            <button
              onClick={() => addToCart(item.id)}
              className="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              Add
            </button>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-lg font-semibold">Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-600">Empty</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {cartItems.map(({ menuItem, quantity }) => (
            <li
              key={menuItem.id}
              className="flex items-center justify-between rounded border border-gray-200 bg-white p-3"
            >
              <span>{menuItem.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeFromCart(menuItem.id)}
                  className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => addToCart(menuItem.id)}
                  className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-4">
        {cartItems.map(({ menuItem, quantity }) => (
          <li key={menuItem.id} className="text-sm text-gray-600">
            {menuItem.name} {quantity}x{menuItem.price}
          </li>
        ))}
      </ul>
      <p className="mt-2 font-medium">Total: {total}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={placeOrder}
        className="mt-2 cursor-pointer rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-700"
      >
        Place Order
      </button>

      <LogoutButton />
    </main>
  );
}
