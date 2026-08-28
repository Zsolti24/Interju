'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-8 ml-4 cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
