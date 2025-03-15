import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificateSchema, CertificateFormValues } from './certificateSchema';
import { useState } from 'react';

export const useCertificateForm = (
  onSubmit: (data: CertificateFormValues) => Promise<void>,
  defaultValues?: CertificateFormValues,
) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: defaultValues || {
      name: '',
      deliveryDate: null,
      expiryDate: null,
      issuingOrganization: '',
      skill: 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    setOpen(false);
  });

  return {
    form,
    open,
    setOpen,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
