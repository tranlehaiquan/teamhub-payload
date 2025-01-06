'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { signup } from '@/services/users';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  className?: string;
}

const SignupForm: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const user = await signup({
        email: data.email,
        password: data.password,
        confirmPassword: data['confirm-password'],
      });

      toast.success(`Account created successfully ${user.doc.email}!`);
      router.push('/login');
    } catch (error) {
      toast.error('Failed to create account, please try again later!');
      console.error(error);
    }
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
              disabled={formState.isSubmitting}
            />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mb-4"
              {...register('password', { required: true })}
              disabled={formState.isSubmitting}
            />

            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              className="mb-4"
              {...register('confirm-password', { required: true })}
              disabled={formState.isSubmitting}
            />

            <Link href="/login" className="mb-4 text-sm inline-block">
              Already have an account? Log in
            </Link>

            <Button className="w-full" disabled={formState.isSubmitting}>
              Sign up
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SignupForm;
