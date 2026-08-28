'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';

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
    <main className="p-4">
      <div className="py-3">Restaurants</div>
      {error && <p>{error}</p>}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="mb-2">
            <Link href={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
            {restaurant.description && <p>{restaurant.description}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-4 py-3">My orders</div>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            <Link href={`/orders/${order.id}`}>
              Order #{order.id} - {order.status}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
