import { MenuTrigger } from "react-aria-components";
import {
  CaretDownIcon,
  CaretUpDownIcon,
  GearIcon,
  HouseIcon,
  LightbulbIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  MailboxIcon,
  MegaphoneIcon,
  PlusIcon,
  QuestionMarkIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SquareIcon,
  TicketIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  SidebarLayout,
  SidebarLayoutContent,
} from "@/components/layouts/sidebar-layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Label } from "@/components/ui/fieldset";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";
import { Option, Select } from "@/components/ui/select";
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MetricText, Title } from "@/components/ui/text";

const orders = [
  {
    id: 3000,
    url: "/orders/3000",
    date: "May 9, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_2HLf8DfYJ0Db7asfCC5T546TY",
      card: {
        number: "1254",
        type: "American Express",
        expiry: "01 / 2025",
      },
    },
    customer: {
      name: "Leslie Alexander",
      email: "leslie.alexander@example.com",
      address: "123 Main St. Toronto, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3001,
    url: "/orders/3001",
    date: "May 5, 2024",
    amount: {
      usd: "$299.00",
      cad: "$409.13",
      fee: "$12.27",
      net: "$396.86",
    },
    payment: {
      transactionId: "ch_1KLf7AsYJ0Dda7fs3CC5d46TY",
      card: {
        number: "3897",
        type: "Visa",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Michael Foster",
      email: "michael.foster@example.com",
      address: "357 Bridge St. New York, NY",
      country: "USA",
      countryFlagUrl: "/flags/us.svg",
    },
    //   event: await getEvent('1001'),
  },
  {
    id: 3002,
    url: "/orders/3002",
    date: "Apr 28, 2024",
    amount: {
      usd: "$150.00",
      cad: "$205.25",
      fee: "$6.15",
      net: "$199.10",
    },
    payment: {
      transactionId: "ch_2DLf5AsYJ0Ddb7fs3CC5d46TY",
      card: {
        number: "7421",
        type: "Mastercard",
        expiry: "12 / 2026",
      },
    },
    customer: {
      name: "Dries Vincent",
      email: "dries.vincent@example.com",
      address: "456 Elm St. Vancouver, BC",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1002'),
  },
  {
    id: 3003,
    url: "/orders/3003",
    date: "Apr 23, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_3KLf6DfYJ0Db7fassCC546TY",
      card: {
        number: "5683",
        type: "Visa",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Lindsay Walton",
      email: "lindsay.walton@example.com",
      address: "789 Oak St. Montreal, QC",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3004,
    url: "/orders/3004",
    date: "Apr 18, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_4HLf7DfYJ0Db78fas3C5d6TY",
      card: {
        number: "9576",
        type: "Visa",
        expiry: "01 / 2025",
      },
    },
    customer: {
      name: "Courtney Henry",
      email: "courtney.henry@example.com",
      address: "321 Pine St. Calgary, AB",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3005,
    url: "/orders/3005",
    date: "Apr 14, 2024",
    amount: {
      usd: "$299.00",
      cad: "$409.13",
      fee: "$12.27",
      net: "$396.86",
    },
    payment: {
      transactionId: "ch_5HLf8DfYJ0Ddb78fas3CC5TY",
      card: {
        number: "2310",
        type: "Visa",
        expiry: "08 / 2024",
      },
    },
    customer: {
      name: "Tom Cook",
      email: "tom.cook@example.com",
      address: "741 Lake St. Miami, FL",
      country: "USA",
      countryFlagUrl: "/flags/us.svg",
    },
    //   event: await getEvent('1001'),
  },
  {
    id: 3006,
    url: "/orders/3006",
    date: "Apr 10, 2024",
    amount: {
      usd: "$150.00",
      cad: "$205.25",
      fee: "$6.15",
      net: "$199.10",
    },
    payment: {
      transactionId: "ch_6KLf9DfYJ0Db7asf3CC54dTY",
      card: {
        number: "6942",
        type: "Mastercard",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Whitney Francis",
      email: "whitney.francis@example.com",
      address: "654 Maple St. Ottawa, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1002'),
  },
  {
    id: 3007,
    url: "/orders/3007",
    date: "Apr 6, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_7KLf6DfYJ0Ddb78fs3C5d6TY",
      card: {
        number: "8473",
        type: "Visa",
        expiry: "08 / 2024",
      },
    },
    customer: {
      name: "Leonard Krasner",
      email: "leonard.krasner@example.com",
      address: "987 Birch St. Winnipeg, MB",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3008,
    url: "/orders/3008",
    date: "Apr 3, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_8HLf5AsYJ0Db78fassCC5d6TY",
      card: {
        number: "5061",
        type: "Visa",
        expiry: "11 / 2026",
      },
    },
    customer: {
      name: "Floyd Miles",
      email: "floyd.miles@example.com",
      address: "147 Cedar St. Quebec City, QC",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3009,
    url: "/orders/3009",
    date: "Mar 29, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_9KLf7DfYJ0Ddb78fas3C5dTY",
      card: {
        number: "3129",
        type: "American Express",
        expiry: "06 / 2025",
      },
    },
    customer: {
      name: "Emily Selman",
      email: "emily.selman@example.com",
      address: "258 Willow St. Halifax, NS",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3010,
    url: "/orders/3010",
    date: "Mar 25, 2024",
    amount: {
      usd: "$299.00",
      cad: "$409.13",
      fee: "$12.27",
      net: "$396.86",
    },
    payment: {
      transactionId: "ch_1KLf8DfYJ0Db78fas3CC54TY",
      card: {
        number: "6498",
        type: "Visa",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Kristin Watson",
      email: "kristin.watson@example.com",
      address: "369 Spruce St. Edmonton, AB",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1001'),
  },
  {
    id: 3011,
    url: "/orders/3011",
    date: "Mar 21, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_2KLf9DfYJ0Db78fas3CC546Y",
      card: {
        number: "1732",
        type: "American Express",
        expiry: "08 / 2024",
      },
    },
    customer: {
      name: "Emma Dorsey",
      email: "emma.dorsey@example.com",
      address: "159 Park St. Chicago, IL",
      country: "USA",
      countryFlagUrl: "/flags/us.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3012,
    url: "/orders/3012",
    date: "Mar 16, 2024",
    amount: {
      usd: "$150.00",
      cad: "$205.25",
      fee: "$6.15",
      net: "$199.10",
    },
    payment: {
      transactionId: "ch_3HLf6DfYJ0Db7afs3CC54dTY",
      card: {
        number: "8256",
        type: "Visa",
        expiry: "01 / 2024",
      },
    },
    customer: {
      name: "Alicia Bell",
      email: "alicia.bell@example.com",
      address: "741 Laurel St. Regina, SK",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1002'),
  },
  {
    id: 3013,
    url: "/orders/3013",
    date: "Mar 12, 2024",
    amount: {
      usd: "$299.00",
      cad: "$409.13",
      fee: "$12.27",
      net: "$396.86",
    },
    payment: {
      transactionId: "ch_4DLf7DfYJ0Db78fs3CC5d46Y",
      card: {
        number: "4901",
        type: "Mastercard",
        expiry: "06 / 2025",
      },
    },
    customer: {
      name: "Jenny Wilson",
      email: "jenny.wilson@example.com",
      address: "852 Ash St. Saskatoon, SK",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1001'),
  },
  {
    id: 3014,
    url: "/orders/3014",
    date: "Mar 8, 2024",
    amount: {
      usd: "$150.00",
      cad: "$205.25",
      fee: "$6.15",
      net: "$199.10",
    },
    payment: {
      transactionId: "ch_5KLf8DfYJ0Db78fssCC54TY",
      card: {
        number: "7365",
        type: "Visa",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Anna Roberts",
      email: "anna.roberts@example.com",
      address: "852 Hill St. Houston, TX",
      country: "USA",
      countryFlagUrl: "/flags/us.svg",
    },
    //   event: await getEvent('1002'),
  },
  {
    id: 3015,
    url: "/orders/3015",
    date: "Mar 4, 2024",
    amount: {
      usd: "$150.00",
      cad: "$205.25",
      fee: "$6.15",
      net: "$199.10",
    },
    payment: {
      transactionId: "ch_6HLf9DfYJ0Db78fas3CC546TY",
      card: {
        number: "2849",
        type: "Visa",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Benjamin Russel",
      email: "benjamin.russel@example.com",
      address: "963 Cherry St. Victoria, BC",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1002'),
  },
  {
    id: 3016,
    url: "/orders/3016",
    date: "Feb 28, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_7HLf6DfYJ0Db78fas3CC546Y",
      card: {
        number: "6132",
        type: "Mastercard",
        expiry: "01 / 2026",
      },
    },
    customer: {
      name: "Jeffrey Webb",
      email: "jeffrey.webb@example.com",
      address: "654 Ocean St. Hamilton, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3017,
    url: "/orders/3017",
    date: "Feb 23, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_8KLf5DfYJ0Db78fas3CC546TY",
      card: {
        number: "9054",
        type: "Mastercard",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Kathryn Murphy",
      email: "kathryn.murphy@example.com",
      address: "357 River St. London, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3018,
    url: "/orders/3018",
    date: "Feb 19, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_9HLf8DfYJ0Db78fas3CC5dTY",
      card: {
        number: "4287",
        type: "Mastercard",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Lawrence Hunter",
      email: "lawrence.hunter@example.com",
      address: "159 Lake St. Mississauga, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3019,
    url: "/orders/3019",
    date: "Feb 15, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_1HLf9DfYJ0Db78fas3CC54TY",
      card: {
        number: "1765",
        type: "Visa",
        expiry: "06 / 2025",
      },
    },
    customer: {
      name: "Yvette Armstrong",
      email: "yvette.armstrong@example.com",
      address: "852 Forest St. Markham, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3020,
    url: "/orders/3020",
    date: "Feb 10, 2024",
    amount: {
      usd: "$299.00",
      cad: "$409.13",
      fee: "$12.27",
      net: "$396.86",
    },
    payment: {
      transactionId: "ch_2DLf6DfYJ0Db78fas3CC546TY",
      card: {
        number: "5923",
        type: "Visa",
        expiry: "12 / 2024",
      },
    },
    customer: {
      name: "Angela Fisher",
      email: "angela.fisher@example.com",
      address: "741 Hill St. Brampton, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1001'),
  },
  {
    id: 3021,
    url: "/orders/3021",
    date: "Feb 5, 2024",
    amount: {
      usd: "$80.00",
      cad: "$109.47",
      fee: "$3.28",
      net: "$106.19",
    },
    payment: {
      transactionId: "ch_3KLf5DfYJ0Db78fassCC546TY",
      card: {
        number: "3014",
        type: "Visa",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Blake Reid",
      email: "blake.reid@example.com",
      address: "369 Valley St. Oshawa, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1000'),
  },
  {
    id: 3022,
    url: "/orders/3022",
    date: "Feb 1, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_4HLf8DfYJ0Db78fas3CC546Y",
      card: {
        number: "8642",
        type: "American Express",
        expiry: "11 / 2026",
      },
    },
    customer: {
      name: "Hector Gibbons",
      email: "hector.gibbons@example.com",
      address: "258 Ridge St. Richmond Hill, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3023,
    url: "/orders/3023",
    date: "Jan 27, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_5KLf9DfYJ0Db78fs3CC546TY",
      card: {
        number: "5173",
        type: "Visa",
        expiry: "12 / 2025",
      },
    },
    customer: {
      name: "Fabricio Mendes",
      email: "fabricio.mendes@example.com",
      address: "147 Park St. Vaughan, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3024,
    url: "/orders/3024",
    date: "Jan 22, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_6HLf6DfYJ0Db78fas3CC5dTY",
      card: {
        number: "6298",
        type: "Mastercard",
        expiry: "06 / 2024",
      },
    },
    customer: {
      name: "Jillian Steward",
      email: "jillian.steward@example.com",
      address: "987 Grove St. Windsor, ON",
      country: "Canada",
      countryFlagUrl: "/flags/ca.svg",
    },
    //   event: await getEvent('1003'),
  },
  {
    id: 3025,
    url: "/orders/3025",
    date: "Jan 18, 2024",
    amount: {
      usd: "$114.99",
      cad: "$157.34",
      fee: "$4.72",
      net: "$152.62",
    },
    payment: {
      transactionId: "ch_7HLf7DfYJ0Db78fas3CC546TY",
      card: {
        number: "9401",
        type: "American Express",
        expiry: "08 / 2025",
      },
    },
    customer: {
      name: "Chelsea Hagon",
      email: "chelsea.hagon@example.com",
      address: "654 Court St. Los Angeles, CA",
      country: "USA",
      countryFlagUrl: "/flags/us.svg",
    },
    //   event: await getEvent('1003'),
  },
];

export const Route = createFileRoute("/layout-preview")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <MailboxIcon />
            </NavbarItem>
            <MenuTrigger>
              <NavbarItem>
                <Avatar
                  shape="square"
                  src="https://avatar.iran.liara.run/public"
                />
              </NavbarItem>
              <Menu className="min-w-64">
                <MenuItem href="/my-profile">
                  <UserIcon />
                  <Label>My profile</Label>
                </MenuItem>
                <MenuItem href="/settings">
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <NavbarDivider />
                <MenuItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <Label>Privacy policy</Label>
                </MenuItem>
                <MenuItem href="/share-feedback">
                  <LightbulbIcon />
                  <Label>Share feedback</Label>
                </MenuItem>
                <NavbarDivider />
                <MenuItem href="/logout">
                  <SignOutIcon />
                  <Label>Sign out</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <MenuTrigger>
              <SidebarItem className="lg:mb-2.5">
                <Avatar src="/tailwind-logo.svg" />
                <SidebarLabel>Tailwind Labs</SidebarLabel>
                <CaretDownIcon />
              </SidebarItem>
              <Menu className="min-w-80 lg:min-w-64">
                <MenuItem href="/teams/1/settings">
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem href="/teams/1">
                  <Avatar slot="icon" src="/tailwind-logo.svg" />
                  <Label>Tailwind Labs</Label>
                </MenuItem>
                <MenuItem href="/teams/2">
                  <Avatar
                    slot="icon"
                    initials="WC"
                    className="bg-purple-500 text-white"
                  />
                  <Label>Workcation</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem href="/teams/create">
                  <PlusIcon />
                  <Label>New team&hellip;</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/search">
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/inbox">
                <MailboxIcon />
                <SidebarLabel>Inbox</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/">
                <HouseIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/events">
                <SquareIcon />
                <SidebarLabel>Events</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/orders">
                <TicketIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <GearIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/broadcasts">
                <MegaphoneIcon />
                <SidebarLabel>Broadcasts</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              <SidebarItem href="/events/1">
                Bear Hug: Live in Concert
              </SidebarItem>
              <SidebarItem href="/events/2">Viking People</SidebarItem>
              <SidebarItem href="/events/3">Six Fingers — DJ Set</SidebarItem>
              <SidebarItem href="/events/4">We All Look The Same</SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog">
                <MagicWandIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <MenuTrigger>
              <SidebarItem>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    shape="square"
                    src="/profile-photo.jpg"
                    className="size-10"
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      Erica
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <CaretUpDownIcon />
              </SidebarItem>
              <Menu className="min-w-64">
                <MenuItem href="/my-profile">
                  <UserIcon />
                  <Label>My profile</Label>
                </MenuItem>
                <MenuItem href="/settings">
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <Label>Privacy policy</Label>
                </MenuItem>
                <MenuItem href="/share-feedback">
                  <LightbulbIcon />
                  <Label>Share feedback</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem href="/logout">
                  <SignOutIcon />
                  <Label>Sign out</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <SidebarLayoutContent className="p-6 lg:p-10">
        <Title size="md">Good afternoon, Erica</Title>
        <div className="mt-8 flex items-end justify-between">
          <Title>Overview</Title>
          <div>
            <Select name="period">
              <Option id="last_week" textValue="last_week">
                Last week
              </Option>
              <Option id="last_two" textValue="last_two">
                Last two weeks
              </Option>
              <Option id="last_month" textValue="last_month">
                Last month
              </Option>
              <Option id="last_quarter" textValue="last_quarter">
                Last quarter
              </Option>
            </Select>
          </div>
        </div>
        <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <Stat title="Total revenue" value="$2.6M" change="+4.5%" />
          <Stat title="Average order value" value="$455" change="-0.5%" />
          <Stat title="Tickets sold" value="5,888" change="+4.5%" />
          <Stat title="Pageviews" value="823,067" change="+21.2%" />
        </div>
        <Label className="mt-14 inline-block font-medium">Recent orders</Label>
        {/* <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]"> */}
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableColumn>Order number</TableColumn>
              <TableColumn>Purchase date</TableColumn>
              <TableColumn>Customer</TableColumn>
              <TableColumn>Event</TableColumn>
              <TableColumn className="text-right">Amount</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow
                  key={order.id}
                  href={order.url}
                  title={`Order #${order.id}`}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell className="text-zinc-500">{order.date}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    {/* <div className="flex items-center gap-2">
                      <Avatar src={order.event.thumbUrl} className="size-6" />
                      <span>{order.event.name}</span>
                    </div> */}
                  </TableCell>
                  <TableCell className="text-right">
                    US{order.amount.usd}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SidebarLayoutContent>
    </SidebarLayout>
  );
}

function Stat({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <MetricText className="mt-3" size="xs">
        {value}
      </MetricText>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge
          content={change}
          color={change.startsWith("+") ? "success" : "danger"}
        />
        <span className="ml-1 inline-block text-neutral-500">
          from last week
        </span>
      </div>
    </div>
  );
}
