'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/trpc/react';

interface Props {
  className?: string;
}

const formSchema = z.object({
  name: z.string().min(5, {
    message: 'Team name must be at least 5 characters.',
  }),
  owner: z.string().min(1, {
    message: 'Owner is required.',
  }),
});

const DialogNewTeam: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const createTeamMutation = api.team.createTeam.useMutation();
  const [open, setOpen] = useState(false);
  const [{ user }] = api.me.getMe.useSuspenseQuery();
  const utils = api.useUtils();
  const { data, isFetched } = api.user.getUsers.useQuery({});
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      owner: String(user.id),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createTeamMutation.mutateAsync({
      name: values.name,
      owner: Number(values.owner),
    });

    setOpen(false);

    utils.team.getTeams.invalidate();
    utils.me.getTeams.invalidate();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={!!children}>{children || 'Create new team'}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <form onSubmit={onSubmit}>
            <Form {...form}>
              <FormItem>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Team name</FormLabel>
                      <FormControl>
                        <Input placeholder="Team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
              <FormItem>
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isFetched &&
                              data?.docs?.map((user) => (
                                <SelectItem key={user.id} value={String(user.id)}>
                                  {user.email}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
              <Button type="submit">Create team</Button>
            </Form>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogNewTeam;
