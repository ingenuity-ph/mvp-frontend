import { MenuTrigger } from "react-aria-components";
import {
  ArrowsDownUpIcon,
  EnvelopeIcon,
  FunnelIcon,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Field, Label } from "@/components/ui/fieldset";
import { SearchInput } from "@/components/ui/input";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { MetricText, Title } from "@/components/ui/text";
import { Header } from "@/components/ui/view";

export const Route = createFileRoute("/examples/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <Card>
        <Header className="flex items-center justify-between">
          <Title>Members</Title>
          <nav className="flex gap-2 items-center">
            <Button variant="outline" color="primary">
              <EnvelopeIcon />
              Bulk Invite
            </Button>
            <Button>
              <PlusIcon />
              Add Member
            </Button>
          </nav>
        </Header>
        <div className="grid grid-cols-2 gap-surface">
          <Card orientation="horizontal">
            <span className="size-16 shrink-0 flex items-center justify-center bg-brand-neutral-muted rounded-control">
              <UsersIcon className="size-8 text-brand-neutral-text" />
            </span>
            <div className="flex flex-col justify-center">
              <MetricText>1</MetricText>
              <Label>Total Members</Label>
            </div>
          </Card>
          <Card orientation="horizontal">
            <span className="size-16 shrink-0 flex items-center justify-center bg-brand-neutral-muted rounded-control">
              <UsersIcon className="size-8 text-brand-neutral-text" />
            </span>
            <div className="flex flex-col justify-center">
              <MetricText>1</MetricText>
              <Label>Total Members</Label>
            </div>
          </Card>
        </div>
        <Divider />
        <div className="flex flex-col gap-surface">
          <div className="flex items-center justify-between">
            <Field>
              <SearchInput
                aria-label="Search Member"
                placeholder="Search Name or Email"
              />
            </Field>
            <div className="flex items-center gap-2">
              <MenuTrigger>
                <Button variant="outline">
                  <FunnelIcon />
                  Filter
                </Button>
                <Menu>
                  <MenuItem>New</MenuItem>
                </Menu>
              </MenuTrigger>
              <MenuTrigger>
                <Button variant="outline">
                  <ArrowsDownUpIcon />
                  Sort
                </Button>
                <Menu>
                  <MenuItem>Ascending</MenuItem>
                  <MenuItem>Descending</MenuItem>
                </Menu>
              </MenuTrigger>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email Address</TableHeader>
              <TableHeader>Phone Number</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Date Created</TableHeader>
              <TableHeader>Created By</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Published</TableHeader>
              <TableHeader>Drafts</TableHeader>
              <TableHeader>Action</TableHeader>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Ethan Sherrod</TableCell>
                <TableCell>ethan@egyptsherrod.com</TableCell>
                <TableCell>+1.123.456.7890</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Dec 7, 2025</TableCell>
                <TableCell>ACCESS Admin</TableCell>
                <TableCell>
                  <Tag color="success">Verified</Tag>
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
