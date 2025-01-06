'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Props {
  className?: string;
}

const ForgotPasswordForm: React.FC<Props> = ({ className }) => {
  return (
    <Card>
      <div className={cn('py-10 px-8')}>
        <h1 className="text-xl text-center mb-5">Forgot password</h1>

        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" className="mb-4" />

        <Link href="/login" className="my-4 text-sm block">
          Back to login
        </Link>

        <Button className="w-full">Login</Button>
      </div>
    </Card>
  );
};

export default ForgotPasswordForm;
