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
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/users';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTeam } from '@/services/teams';
import { getUsersQuery, meQuery } from '@/tanQueries';

interface Props {
  className?: string;
}

const DialogNewUsers: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  return <div>{children}</div>;
};

export default DialogNewUsers;
