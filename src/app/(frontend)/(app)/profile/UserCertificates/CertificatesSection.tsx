'use client';
import { Card } from '@/components/ui/card';
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
import { Plus, XIcon } from 'lucide-react';
import { Skill, UsersSkill } from '@/payload-types';
import { removeUserCertificate } from '@/services/server/currentUser';
import { toast } from 'sonner';
import DialogCertificate from './DialogCertificate';
import { api } from '@/trpc/react';

const CertificatesSection: React.FC = () => {
  const [{ docs: certificates }] = api.me.getCertificates.useSuspenseQuery();
  const utils = api.useUtils();

  const handleRemoveCertificate = async (certificateId: number) => {
    await removeUserCertificate(certificateId);
    toast.success('Certificate removed successfully');
    utils.me.getCertificates.invalidate();
  };

  return (
    <Card className="p-4">
      <p className="mb-2 text-lg">Certificates</p>

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

      <DialogCertificate>
        <Button className="mt-4">
          <Plus size={16} className="mr-2" />
          Add Certificate
        </Button>
      </DialogCertificate>
    </Card>
  );
};

export default CertificatesSection;
