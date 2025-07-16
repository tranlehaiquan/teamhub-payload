'use client';
import type { Media, Profile } from '@/payload-types';
import type React from 'react';
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
import { toast } from 'sonner';
import { UserAvatar } from '@/components/UserProfile';
import { getAvatarFallback } from '@/utilities/getAvatarFallback';
import { api } from '@/trpc/react';
import { uploadAvatar } from '@/services/server/uploadAvatar';
import SectionCard from '@/components/SectionCard/SectionCard';

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
  const utils = api.useUtils();
  const mutationProfile = api.me.updateProfile.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutationProfile.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      utils.me.getMe.invalidate();
      toast.success('Profile updated');

      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch {
      toast.error('Failed to update profile');
    }
  });

  const onChangeAvatar = async (file: File) => {
    let uploadFile = file;
    const size = uploadFile.size;

    // if size > 3mb then show error
    if (size > 3 * 1024 * 1024) {
      const compressor = (await import('@/utilities/image-compressor')).default;

      // convert file
      const result = await compressor(file, {
        quality: 0.9,
        maxWidth: 800,
        mimeType: 'image/jpeg',
      });

      uploadFile = result as File;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const result = await uploadAvatar(formData);
      utils.me.getMe.invalidate();

      toast.success(result.success ? 'Avatar uploaded' : 'Failed to upload avatar');
    } catch {
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <SectionCard title="Account">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <UserAvatar
              avatar={profile.avatar as Media}
              onChange={onChangeAvatar}
              className="h-24 w-24"
              fallback={getAvatarFallback(profile)}
            />
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

          <Button disabled={form.formState.isSubmitting || !form.formState.isDirty}>Submit</Button>
        </form>
      </Form>
    </SectionCard>
  );
};

export default AccountForm;
