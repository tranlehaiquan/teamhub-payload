'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface Props {
  className?: string;
  teamId: string;
}

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const TeamSettingForm: React.FC<Props> = ({ teamId }) => {
  const utils = api.useUtils();
  const mutation = api.team.updateTeamById.useMutation();
  const [team] = api.team.getTeamById.useSuspenseQuery(Number(teamId));
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: team.name,
      description: team.description || '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const team = await mutation.mutateAsync({
        id: Number(teamId),
        ...values,
      });
      toast.success('Team updated');
      form.reset({ name: team.name, description: team.description || '' });
      utils.team.getTeamById.invalidate(Number(teamId));
    } catch (error) {
      toast.error('Failed to update team');
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Team name description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
          Save
        </Button>
      </form>
    </Form>
  );
};

export default TeamSettingForm;
