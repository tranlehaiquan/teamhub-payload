'use client';
import { Card } from '@/components/ui/card';
import { getCurrentUserCertificatesQuery } from '@/tanQueries';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns/format';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skill, UsersSkill } from '@/payload-types';

const CertificatesSection: React.FC = () => {
  const {
    data: { docs: certificates },
  } = useSuspenseQuery(getCurrentUserCertificatesQuery);

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
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total: {certificates.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Button className="mt-4">
        <Plus size={16} className="mr-2" />
        Add Certificate
      </Button>
    </Card>
  );
};

export default CertificatesSection;
