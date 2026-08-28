'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { LogoutButton } from '@/components/LogoutButton';

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  menuItem: { id: number; name: string };
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrderPage() {
  useRequireAuth();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Order>(`/orders/${params.id}`)
      .then((response) => setOrder(response.data))
      .catch(() => setError('Order not found'));
  }, [params.id]);

  const backButton = (
    <Link
      href="/restaurants"
      className="inline-block rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
    >
      Back
    </Link>
  );

  if (error) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        {backButton}
        <p className="mt-4 text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        {backButton}
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      </main>
    );
  }

  const total = order.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-2xl p-6">
      {backButton}
      <h1 className="mt-4 text-xl font-semibold">Order #{order.id}</h1>
      <p className="text-sm text-gray-600">Status: {order.status}</p>

      <ul className="mt-4 flex flex-col gap-2">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white p-3"
          >
            <span>
              {item.menuItem.name} x {item.quantity}
            </span>
            <span className="text-gray-600">{item.unitPrice}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-medium">Total: {total}</p>

      <LogoutButton />
    </main>
  );
}
