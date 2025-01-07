'use client';
import { Media, Profile } from '@/payload-types';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';
import { updateProfileById } from '@/services/profiles';
import { toast } from 'sonner';
import { Media as MediaComponent } from '@/components/Media';

interface Props {
  className?: string;
  profile: Profile;
}

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
});

const AccountForm: React.FC<Props> = ({ profile }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateProfileById(profile.id, {
        firstName: data.firstName,
        lastName: data.lastName,
      });

      queryClient.invalidateQueries({
        queryKey: ['user-profile'],
      });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  });

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={onSubmit} className="p-4">
          <div className="mb-4">
            {profile.avatar && (
              <div className="w-24 h-24 relative rounded-full overflow-hidden">
                <MediaComponent resource={profile.avatar} fill />
              </div>
            )}
            Implement upload file later
          </div>

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button>Submit</Button>
        </form>
      </Form>
    </Card>
  );
};

export default AccountForm;
