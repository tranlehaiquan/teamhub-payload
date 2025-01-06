import { Metadata } from 'next';
import React from 'react';
import LogoutPage from './Logout';

export function generateMetadata(): Metadata {
  return {
    title: `Logout - TeamHub`,
  };
}

const Page = () => {
  return <LogoutPage />;
};

export default Page;
