import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { User } from '@/payload-types';
import DialogNewTeam from './DialogNewTeam';

const PageTeams = async () => {
  const me = await getMeUser();
  const payload = await getPayloadFromConfig();
  const teamDocs = await payload.find({
    collection: 'teams',
    user: me.user,
  });
  const teams = teamDocs.docs;

  return (
    <div>
      <div>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">TeamHub</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Teams</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-2xl font-bold">Users</h1>

          <div className="my-4">
            <DialogNewTeam>
              <Button>Create Team</Button>
            </DialogNewTeam>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created at</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.id}</TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell className="font-medium">{(team.owner as User).email}</TableCell>
                  <TableCell>{team.members?.docs?.length}</TableCell>
                  <TableCell className="font-medium">
                    {team.createdAt && new Date(team.createdAt).toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PageTeams;
