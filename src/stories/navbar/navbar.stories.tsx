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
  title: "navigation/Navbar",
  component: Navbar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="w-2xl">
        <Navbar>
          <MenuTrigger>
            <NavbarItem>
              <Avatar
                className="bg-purple-500 text-white"
                src="https://avatar.iran.liara.run/public"
              />
              <NavbarLabel>Ingenuity Labs</NavbarLabel>
              <CaretDownIcon />
            </NavbarItem>
            <Menu className="min-w-64">
              <MenuItem>
                <GearIcon />
                <MenuLabel>Settings</MenuLabel>
              </MenuItem>
              <Divider inset="none" />
              <MenuItem>
                <Avatar
                  data-slot="icon"
                  className="bg-purple-500 text-white"
                  src="https://avatar.iran.liara.run/public"
                />
                <MenuLabel>Tailwind Labs</MenuLabel>
              </MenuItem>
              <MenuItem>
                <Avatar
                  data-slot="icon"
                  initials="WC"
                  src="https://avatar.iran.liara.run/public"
                  className="bg-purple-500 text-white"
                />
                <MenuLabel>Workcation</MenuLabel>
              </MenuItem>
              <Divider inset="none" />
              <MenuItem>
                <PlusIcon />
                <MenuLabel>New team&hellip;</MenuLabel>
              </MenuItem>
            </Menu>
          </MenuTrigger>
          <Divider inset="none" className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            <NavbarItem current>Home</NavbarItem>
            <NavbarItem>Events</NavbarItem>
            <NavbarItem>Orders</NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem aria-label="Inbox">
              <TrayIcon weight="fill" />
            </NavbarItem>
            <MenuTrigger>
              <AvatarButton
                className="size-8"
                src="https://i.pravatar.cc/150?img=3"
              />
              <Menu className="min-w-64">
                <MenuItem>
                  <UserIcon weight="fill" />
                  <MenuLabel>My profile</MenuLabel>
                </MenuItem>
                <MenuItem>
                  <GearIcon weight="fill" />
                  <MenuLabel>Settings</MenuLabel>
                </MenuItem>
                <Divider inset="none" />
                <MenuItem>
                  <ShieldCheckIcon weight="fill" />
                  <MenuLabel>Privacy policy</MenuLabel>
                </MenuItem>
                <MenuItem>
                  <LightbulbIcon weight="fill" />
                  <MenuLabel>Share feedback</MenuLabel>
                </MenuItem>
                <Divider inset="none" />
                <MenuItem>
                  <SignOutIcon weight="fill" />
                  <MenuLabel>Sign out</MenuLabel>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </NavbarSection>
        </Navbar>
      </div>
    );
  },
};
