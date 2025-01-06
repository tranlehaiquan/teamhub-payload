'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { forgotPassword } from '@/services/users';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ForgotPasswordForm: React.FC = () => {
  const [isSuccessSend, setIsSuccessSend] = React.useState(false);
  const formMethods = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = formMethods.handleSubmit(async (data) => {
    try {
      await forgotPassword(data);

      toast.success('Password reset email sent');
      setIsSuccessSend(true);
    } catch {
      toast.error('Error sending password reset email');
    }
  });

  return (
    <Card>
      {!isSuccessSend && (
        <form className={cn('py-10 px-8')} onSubmit={onSubmit}>
          <h1 className="text-xl text-center mb-5">Forgot password</h1>

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="mb-4"
            {...formMethods.register('email')}
            disabled={formMethods.formState.isSubmitting}
          />

          <Link href="/login" className="my-4 text-sm block">
            Back to login
          </Link>

          <Button className="w-full" disabled={formMethods.formState.isSubmitting}>
            Forgot password
          </Button>
        </form>
      )}

      {isSuccessSend && (
        <div className={cn('py-10 px-8')}>
          <h1 className="text-xl text-center mb-5">Password reset email sent</h1>
          <p className="text-center">
            Please check your email for further instructions on how to reset your password.
          </p>
        </div>
      )}
    </Card>
  );
};

export default ForgotPasswordForm;
