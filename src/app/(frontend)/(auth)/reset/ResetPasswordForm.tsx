'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import { useForm } from 'react-hook-form';
import { resetPasswordAfterForgot } from '@/services/users';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Props {
  className?: string;
}

const ResetPasswordForm: React.FC<Props> = ({ className }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPasswordAfterForgot({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Password reset successfully');

      router.push('/');
    } catch {
      toast.error('Failed to reset password');
    }
  });

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <div className={cn('py-10 px-8')}>
          <h1 className="text-xl text-center mb-5">Reset password</h1>

          <form onSubmit={onSubmit}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mb-4"
              disabled={formState.isSubmitting}
              {...register('password')}
            />

            <Label htmlFor="email">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Enter your confirmPassword"
              className="mb-4"
              disabled={formState.isSubmitting}
              {...register('confirmPassword')}
            />

            <Button className="w-full" disabled={formState.isSubmitting}>
              Reset
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
