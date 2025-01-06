'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';

interface Props {
  className?: string;
}

const SignupForm: React.FC<Props> = ({ className }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <div className={cn('py-10 px-8')}>
          <h1 className="text-xl text-center mb-5">Sign up to your account</h1>

          <form onSubmit={onSubmit}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mb-4"
              {...register('email', { required: true })}
            />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mb-4"
              {...register('password', { required: true })}
            />

            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              className="mb-4"
              {...register('confirm-password', { required: true })}
            />

            <Link href="/forgotPassword" className="mb-4 text-sm inline-block">
              Forgot your password?
            </Link>

            <Button className="w-full">Sign up</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SignupForm;
