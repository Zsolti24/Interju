'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { LogoutButton } from '@/components/LogoutButton';

type Restaurant = {
  id: number;
  name: string;
  description: string | null;
};

type Order = {
  id: number;
  status: string;
};

export default function RestaurantsPage() {
  useRequireAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Restaurant[]>('/restaurants')
      .then((response) => setRestaurants(response.data))
      .catch(() => setError('Failed to load restaurants'));

    api
      .get<Order[]>('/orders')
      .then((response) => setOrders(response.data))
      .catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-xl font-semibold">Restaurants</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="flex flex-col gap-2">
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <Link
              href={`/restaurants/${restaurant.id}`}
              className="block rounded border border-gray-200 bg-white p-4 hover:border-gray-400"
            >
              <div className="font-medium">{restaurant.name}</div>
              {restaurant.description && (
                <p className="text-sm text-gray-600">{restaurant.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 mb-4 text-lg font-semibold">My orders</h2>
      <ul className="flex flex-col gap-2">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="block rounded border border-gray-200 bg-white px-4 py-2 hover:border-gray-400"
            >
              Order #{order.id} <span className="text-gray-600">- {order.status}</span>
            </Link>
          </li>
        ))}
      </ul>

      <LogoutButton />
    </main>
  );
}
