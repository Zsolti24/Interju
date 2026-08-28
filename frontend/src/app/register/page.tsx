'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.accessToken);
      router.push('/restaurants');
    } catch {
      setError('Registration failed');
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-xl font-semibold">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-gray-600">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="cursor-pointer rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-700"
        >
          Register
        </button>
      </form>
      <Link
        href="/login"
        className="mt-4 inline-block rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
      >
        Login page
      </Link>
    </main>
  );
}
