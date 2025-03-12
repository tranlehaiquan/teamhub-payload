'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns/format';
import { Button } from '@/components/ui/button';
import { Pen, Plus, XIcon } from 'lucide-react';
import { Skill, UsersSkill } from '@/payload-types';
import { toast } from 'sonner';
import DialogCertificate, { FormValues } from './DialogCertificate';
import { api } from '@/trpc/react';
import SectionCard from '@/components/SectionCard/SectionCard';

const CertificatesSection: React.FC = () => {
  const removeCertificateMutation = api.me.removeCertificate.useMutation();
  const [{ docs: certificates }] = api.me.getCertificates.useSuspenseQuery();
  const utils = api.useUtils();

  const handleRemoveCertificate = async (certificateId: number) => {
    await removeCertificateMutation.mutateAsync(certificateId);
    toast.success('Certificate removed successfully');
    utils.me.getCertificates.invalidate();
  };
  const addCertificateMutation = api.me.addCertificate.useMutation();
  const updateCertificateMutation = api.me.updateCertificate.useMutation();

  const onCreateNewCertificate = async (data: FormValues) => {
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
    } catch {
      toast.error('Failed to add certificate');
    }
  };

  const onUpdateCertificate = async (data: FormValues & { id: number }) => {
    try {
      await updateCertificateMutation.mutateAsync({
        id: data.id,
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        deliveryDate: data.deliveryDate,
        expiryDate: data.expiryDate,
        userSkills: data.skill ? [data.skill] : [],
      });

      utils.me.getCertificates.invalidate();
      toast.success('Certificate updated');
    } catch {
      toast.error('Failed to update certificate');
    }
  };

  return (
    <SectionCard className="p-4" title="Certificates">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Expire Date</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate) => (
            <TableRow key={certificate.id}>
              <TableCell>{certificate.id}</TableCell>
              <TableCell>{certificate.name}</TableCell>
              <TableCell>
                {certificate.deliveryDate ? format(certificate.deliveryDate, 'dd MMM yyyy') : '---'}
              </TableCell>
              <TableCell>
                {certificate.expiryDate ? format(certificate.expiryDate, 'dd MMM yyyy') : '---'}
              </TableCell>
              <TableCell>
                {certificate.userSkills?.map((i: UsersSkill) => (i.skill as Skill).name).join(', ')}
              </TableCell>
              <TableCell className="text-right">
                <DialogCertificate
                  onSubmit={(data) => onUpdateCertificate({ ...data, id: certificate.id })}
                  defaultValues={{
                    name: certificate.name,
                    issuingOrganization: certificate.issuingOrganization,
                    deliveryDate: certificate.deliveryDate
                      ? new Date(certificate.deliveryDate)
                      : null,
                    expiryDate: certificate.expiryDate ? new Date(certificate.expiryDate) : null,
                    skill: (certificate.userSkills?.[0] as UsersSkill)?.id,
                  }}
                >
                  <Button size={'icon'} variant={'ghost'} className="rounded-full">
                    <Pen size={16} />
                  </Button>
                </DialogCertificate>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  onClick={() => handleRemoveCertificate(certificate.id)}
                  className="rounded-full"
                >
                  <XIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DialogCertificate onSubmit={onCreateNewCertificate}>
        <Button className="mt-4">
          <Plus size={16} className="mr-2" />
          Add Certificate
        </Button>
      </DialogCertificate>
    </SectionCard>
  );
};

export default CertificatesSection;
