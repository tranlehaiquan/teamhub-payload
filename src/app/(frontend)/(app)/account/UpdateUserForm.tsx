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

const formSchema = z.object({
  reportTo: z.number().nullable(),
});

const UpdateUserForm: React.FC = () => {
  const [me] = api.me.getMe.useSuspenseQuery();
  const reportTo = me.user.reportTo as User | null;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportTo: reportTo?.id || null,
    },
  });

  const updateReportTo = api.me.updateReportTo.useMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateReportTo.mutateAsync({
        reportTo: data.reportTo,
      });

      form.reset({
        reportTo: data.reportTo,
      });
      toast.success('Report to updated');
    } catch (error) {
      toast.error(error.message ? error.message : '');
    }
  });

  return (
    <SectionCard title="User settings">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="reportTo"
            render={({ field }) => (
              <FormItem className="mb-4">
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

          <Button
            type="submit"
            className="mt-4"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </Form>
    </SectionCard>
  );
};

export default UpdateUserForm;
