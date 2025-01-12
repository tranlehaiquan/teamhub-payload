'use client';
import React from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/users';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTeam } from '@/services/teams';

interface Props {
  className?: string;
}

const formSchema = z.object({
  name: z.string().min(5, {
    message: 'Team name must be at least 5 characters.',
  }),
  owner: z.string(),
});

const DialogNewTeam: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const { data, isFetched } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      owner: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const newTeam = await createTeam({
      name: values.name,
      owner: Number(values.owner),
    });

    console.log(newTeam);
  });

  return (
    <Dialog>
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
