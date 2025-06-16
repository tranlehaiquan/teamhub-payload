import type React from 'react';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { api } from '@/trpc/react';
import type { CertificateFormValues } from './certificateSchema';
import { useCertificateForm } from './useCertificateForm';
import { CertificateForm } from './CertificateForm';

interface Props {
  className?: string;
  onSubmit: (data: CertificateFormValues) => Promise<void>;
  defaultValues?: CertificateFormValues;
}

const DialogCertificate: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onSubmit,
  defaultValues,
}) => {
  const { form, open, setOpen, handleSubmit, isSubmitting } = useCertificateForm(
    onSubmit,
    defaultValues,
  );
  const [userSkills] = api.me.userSkills.useSuspenseQuery();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues?.name ? 'Update Certificate' : 'Add Certificate'}
          </DialogTitle>
        </DialogHeader>

        <CertificateForm
          form={form}
          userSkills={userSkills}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogCertificate;
