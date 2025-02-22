import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/ui/datepicker';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skill } from '@/payload-types';
import { api } from '@/trpc/react';

interface Props {
  className?: string;
}

const zSchema = zod
  .object({
    name: zod.string().nonempty({
      message: 'Name is required',
    }),
    issuingOrganization: zod.string().min(1, {
      message: 'Issuing organization is required',
    }),
    deliveryDate: zod.date().optional().nullable().optional(),
    expiryDate: zod.date().optional().nullable().optional(),
    skill: zod.number({
      message: 'Skill is required',
    }),
  })
  .refine(
    (data) => {
      if (data.deliveryDate && data.expiryDate && data.expiryDate < data.deliveryDate) {
        return false;
      }

      return true;
    },
    {
      path: ['expiryDate'],
      message: 'Expiry date must great than delivery date',
    },
  );

const DialogCertificate: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(zSchema),
    defaultValues: {
      name: '',
      deliveryDate: null,
      expiryDate: null,
      issuingOrganization: '',
    },
  });
  const addCertificateMutation = api.me.addCertificate.useMutation();
  const [{ docs: userSkills }] = api.me.userSkill.useSuspenseQuery();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await addCertificateMutation.mutateAsync({
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        deliveryDate: data.deliveryDate,
        expiryDate: data.expiryDate,
        userSkills: data.skill ? [data.skill] : [],
      });

      utils.me.getCertificates.invalidate();
      toast.success('Certificate added');
      setOpen(false);
      form.reset();
    } catch {
      toast.error('Failed to add certificate');
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Certificate</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
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
                name="issuingOrganization"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Issuing Organization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            {/* deliveryDate */}
            <FormItem>
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Delivery Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            {/* expiryDate */}
            <FormItem>
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>

            {/* skills */}
            <FormItem>
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        defaultValue={field.value ? String(field.value) : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your desired level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userSkills.map((userSkill) => (
                            <SelectItem key={userSkill.id} value={String(userSkill.id)}>
                              {(userSkill.skill as Skill)?.name}
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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCertificate;
