/* eslint-disable import/no-default-export */
import { Avatar, AvatarButton } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Menu, MenuItem, MenuLabel } from "@/components/ui/menu";
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  CaretDownIcon,
  GearIcon,
  LightbulbIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShieldCheckIcon,
  SignOutIcon,
  TrayIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuTrigger } from "react-aria-components";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "navigation/Pagination",
  component: Pagination,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Pagination>
        <PaginationPrevious href="." />
        <PaginationList>
          <PaginationPage href=".">1</PaginationPage>
          <PaginationPage href=".">2</PaginationPage>
          <PaginationPage href="." current>
            3
          </PaginationPage>
          <PaginationPage href=".">4</PaginationPage>
          <PaginationGap />
          <PaginationPage href=".">65</PaginationPage>
          <PaginationPage href=".">66</PaginationPage>
        </PaginationList>
        <PaginationNext href="." />
      </Pagination>
    );
  },
};
