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
import { createUserCertificate } from '@/services/server/currentUser/getUserInfo';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  getCurrentUserCertificatesQuery,
  getCurrentUserSkillsQuery,
  getSkillsQuery,
} from '@/tanQueries';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skill } from '@/payload-types';

interface Props {
  className?: string;
}

const zSchema = zod.object({
  name: zod.string().nonempty({
    message: 'Name is required',
  }),
  issuingOrganization: zod.string().min(1, {
    message: 'Issuing organization is required',
  }),
  deliveryDate: zod.date().optional(),
  expiryDate: zod.date().optional(),
  skill: zod.number().optional(),
});

const DialogCertificate: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(zSchema),
    defaultValues: {
      name: '',
      deliveryDate: null,
      expiryDate: null,
      skill: null,
      issuingOrganization: '',
    },
  });
  const {
    data: { docs: userSkills },
  } = useSuspenseQuery(getCurrentUserSkillsQuery);
  const {
    data: { docs: skills },
  } = useSuspenseQuery(getSkillsQuery);

  const skillById = skills.reduce<{
    [key: number]: Skill;
  }>((acc, skill) => {
    acc[skill.id] = skill;
    return acc;
  }, {});

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      console.log(data);
      await createUserCertificate({
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString() : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
        userSkills: data.skill ? [data.skill] : [],
      });

      queryClient.invalidateQueries(getCurrentUserCertificatesQuery);
      toast.success('Certificate added');
      setOpen(false);
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
                              {skillById[userSkill.skill as number]?.name}
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

            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCertificate;
