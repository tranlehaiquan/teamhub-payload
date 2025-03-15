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
import { api } from '@/trpc/react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from '@/components/ui/datepicker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TrainingStatusValues, trainingStatusOptions } from '@/collections/Trainings/constants';

// Define the schema for the form
const trainingSchema = z
  .object({
    name: z.string().nonempty('Name is required'),
    link: z.string().url().optional(),
    description: z.string().optional(),
    status: z.enum(TrainingStatusValues).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

// type infer
export type FormValues = z.infer<typeof trainingSchema>;

type Props = {
  onSubmit: (data: FormValues) => Promise<void>;
  defaultValues?: FormValues;
};

const DialogTraining: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  defaultValues,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(trainingSchema),
    defaultValues: defaultValues ?? {
      name: '',
      link: '',
      description: '',
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const handleOnSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit Training' : 'Add Training'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleOnSubmit}>
            <FormItem>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="aws, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {trainingStatusOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
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

            <FormItem>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        placeHolder="Select date (MM/DD/YYYY)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        placeHolder="Select date (MM/DD/YYYY)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTraining;
