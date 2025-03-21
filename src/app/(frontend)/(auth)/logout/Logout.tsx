'use client';
import { logout } from '@/services/users';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LogoutPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [dots, setDots] = useState('');

  // Animate the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Handle logout
  useEffect(() => {
    const logoutUser = async () => {
      try {
        await logout();
        queryClient.clear();
        // Small delay for animation to be visible
        setTimeout(() => router.push('/login'), 1500);
      } catch (error) {
        console.error('Logout failed:', error);
        router.push('/login');
      }
    };

    logoutUser();
  }, [queryClient, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className="mb-6">
          {/* You can add your logo here */}
          <div className="text-4xl font-bold text-indigo-600 mb-2">TeamHub</div>
          <div className="h-1 w-16 bg-indigo-600 mx-auto rounded"></div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Signing Out</h1>
        <p className="text-gray-600 mb-6">We're securely logging you out{dots}</p>

        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>

        <p className="text-sm text-gray-500">You'll be redirected to the login page shortly.</p>
      </div>
    </div>
  );
};

export default LogoutPage;
