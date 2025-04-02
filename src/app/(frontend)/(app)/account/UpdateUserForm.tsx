import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { ComboboxSearchUser } from './ComboboxSearchUser';
import SectionCard from '@/components/SectionCard/SectionCard';
import { User } from '@/payload-types';
import { ComboboxSearchJobTitles } from '@/components/ComboboxSearchJobTitle/CombboboxSearchJobTitle';

// Define the form schema with proper typing
const formSchema = z.object({
  reportTo: z.number().nullable(),
  jobTitle: z.string().optional(),
});

// Create a type from the schema for better type safety
type FormValues = z.infer<typeof formSchema>;

const UpdateUserForm: React.FC = () => {
  const [me] = api.me.getMe.useSuspenseQuery();
  const reportTo = me.user.reportTo as User | null;
  const updateMe = api.me.updateMe.useMutation();
  const utils = api.useUtils();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportTo: reportTo?.id || null,
      jobTitle: me.user.jobTitle || '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMe.mutateAsync({
        reportTo: data.reportTo,
        jobTitle: data.jobTitle,
      });

      form.reset({
        reportTo: data.reportTo,
        jobTitle: data.jobTitle,
      });
      utils.me.getMe.invalidate();
      toast.success('User settings updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update report to';
      toast.error(errorMessage);
    }
  });

  return (
    <SectionCard title="User settings">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="reportTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report to</FormLabel>
                <FormControl>
                  <ComboboxSearchUser
                    value={field.value ? String(field.value) : undefined}
                    onSelect={(value) => {
                      field.onChange(Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <ComboboxSearchJobTitles
                  value={field.value}
                  onSelect={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Select job title"
                />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
            {form.formState.isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </Form>
    </SectionCard>
  );
};

export default UpdateUserForm;
