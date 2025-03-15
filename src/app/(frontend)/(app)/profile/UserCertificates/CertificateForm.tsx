import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/ui/datepicker';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skill } from '@/payload-types';
import { CertificateFormValues } from './certificateSchema';

interface CertificateFormProps {
  form: UseFormReturn<CertificateFormValues>;
  userSkills: any[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
  form,
  userSkills,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
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

        {/* deliveryDate */}
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
                  placeHolder="Select date (MM/DD/YYYY)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* expiryDate */}
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
                  placeHolder="Select date (MM/DD/YYYY)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* skills */}
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
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userSkills.map((userSkill) => (
                      <SelectItem
                        key={userSkill.id}
                        value={String(userSkill.id)}
                        data-testid="select-item"
                      >
                        {(userSkill.skill as Skill).name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
