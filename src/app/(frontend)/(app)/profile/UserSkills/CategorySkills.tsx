'use client';
import React, { useEffect, useState } from 'react';
import { Category, Skill, UsersSkill } from '@/payload-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pen, XIcon } from 'lucide-react';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { updateCurrentUserSkill } from '@/services/server/currentUser';
import { getCurrentUserSkillsQuery } from '@/tanQueries';
import { toast } from 'sonner';

interface CategorySkillsProps {
  categoryId: string;
  userSkills: UsersSkill[];
  skills: Skill[];
  categories: Category[];
  handleRemoveSkill: (skillId: number) => Promise<void>;
}

const CategorySkills: React.FC<CategorySkillsProps> = ({
  categoryId,
  userSkills,
  categories,
  handleRemoveSkill,
}) => {
  const [openUpdateDialog, setOpenUpdateDialog] = useState<number>();
  const category = categories.find((s) => s.id === Number(categoryId));
  const selectedUserSkill = userSkills.find((s) => s.id === openUpdateDialog);

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        {category?.title || 'Another'}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Skill</TableHead>
            <TableHead className="text-center">Current Level</TableHead>
            <TableHead className="text-center">Desired Level</TableHead>
            <TableHead className="text-center">Trainings</TableHead>
            <TableHead className="text-center">Certificates</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userSkills.map((userSkill) => (
            <TableRow key={userSkill.id}>
              <TableCell className="font-medium">
                <p>{(userSkill.skill as Skill).name}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>{userSkill.currentLevel || '---'}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>{userSkill.desiredLevel || '---'}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>---</p>
              </TableCell>
              <TableCell className="text-center">
                <p>---</p>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setOpenUpdateDialog(userSkill.id)}
                >
                  <Pen />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => handleRemoveSkill((userSkill.skill as Skill).id)}
                >
                  <XIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog Update UserSkill */}
      <DialogUpdateUserSkill
        userSkill={selectedUserSkill}
        onClose={() => setOpenUpdateDialog(undefined)}
      />
    </div>
  );
};

const zSchema = z
  .object({
    currentLevel: z.number().optional().nullable(),
    desiredLevel: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.currentLevel && data.desiredLevel && data.currentLevel > data.desiredLevel) {
        return false;
      }

      return true;
    },
    {
      path: ['desiredLevel'],
      message: 'Desired level should be greater than or equal current level',
    },
  );

const LEVELS = [
  {
    value: 1,
    label: 'Fundamental',
  },
  {
    value: 2,
    label: 'Novice',
  },
  {
    value: 3,
    label: 'Intermediate',
  },
  {
    value: 4,
    label: 'Advanced',
  },
  {
    value: 5,
    label: 'Expert',
  },
];

const DialogUpdateUserSkill = ({
  userSkill,
  onClose,
}: {
  userSkill?: UsersSkill;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      currentLevel: userSkill?.currentLevel,
      desiredLevel: userSkill?.desiredLevel,
    },
    resolver: zodResolver(zSchema),
  });

  useEffect(() => {
    form.reset({
      currentLevel: userSkill?.currentLevel,
      desiredLevel: userSkill?.desiredLevel,
    });
  }, [userSkill]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!userSkill) return;

    const result = await updateCurrentUserSkill(
      userSkill.id,
      values as {
        currentLevel?: number;
        desiredLevel?: number;
      },
    );

    if (result.success) {
      queryClient.invalidateQueries(getCurrentUserSkillsQuery);
      toast.success(`Skill updated successfully`);
      form.reset();
      onClose();
    }
  });

  return (
    <Dialog open={Boolean(userSkill)} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Skill</DialogTitle>
          <Form {...form}>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Level</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your current level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level.value} value={String(level.value)}>
                            {level.value} - {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* desired level */}
              <FormField
                control={form.control}
                name="desiredLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Level</FormLabel>
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
                        {LEVELS.map((level) => (
                          <SelectItem key={level.value} value={String(level.value)}>
                            {level.value} - {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                Update
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySkills;
