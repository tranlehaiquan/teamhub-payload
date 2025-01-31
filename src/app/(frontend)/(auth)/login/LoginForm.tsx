'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { login } from '@/services/users';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

interface Props {
  className?: string;
}

const LoginForm: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const user = await login(data);

    if (user.errors) {
      const message = user.errors?.[0]?.message || 'Failed to login';
      toast.error(message);
      return;
    }

    await utils.me.getMe.invalidate();
    toast.success('Success login');
    router.push('/');
  });

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <div className={cn('py-10 px-8')}>
          <h1 className="text-xl text-center mb-5">Login to your account</h1>

          <form onSubmit={onSubmit}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mb-4"
              disabled={formState.isSubmitting}
              {...register('email')}
            />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mb-4"
              disabled={formState.isSubmitting}
              {...register('password')}
            />

            <Link href="/forgotPassword" className="mb-4 text-sm inline-block">
              Forgot your password?
            </Link>

            <Button className="w-full" disabled={formState.isSubmitting}>
              Login
            </Button>
          </form>

          <Link href="/signup" className="mt-4 text-sm block text-center">
            Don&lsquo;t have an account? Signup
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
