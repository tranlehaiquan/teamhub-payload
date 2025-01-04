'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';

interface Props {
  className?: string;
}

const SignupForm: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('w-[500px] mx-auto p-16 border rounded-2xl', className)}>
      <h1 className="text-xl text-center mb-5">Signup to your account</h1>

      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" className="mb-4" />

      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter your password" className="mb-4" />

      <Link href="/forgotPassword" className="mb-4 text-sm inline-block">
        Forgot your password?
      </Link>

      <Button className="w-full">Login</Button>
    </div>
  );
};

export default SignupForm;
