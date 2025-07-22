import { useState } from "react";
import {
  CalendarBlankIcon,
  CheckCircleIcon,
  CreditCardIcon,
  FireIcon,
  HeartIcon,
  PaperclipIcon,
  SmileyIcon,
  SmileySadIcon,
  ThumbsUpIcon,
  UserCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Tag } from "@/components/ui/tag";
import { Title } from "@/components/ui/text";
import { cn } from "@/components/ui/utils";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Invoices", href: "#" },
  { name: "Clients", href: "#" },
  { name: "Expenses", href: "#" },
];
const invoice = {
  subTotal: "$8,800.00",
  tax: "$1,760.00",
  total: "$10,560.00",
  items: [
    {
      id: 1,
      title: "Logo redesign",
      description: "New logo and digital asset playbook.",
      hours: "20.0",
      rate: "$100.00",
      price: "$2,000.00",
    },
    {
      id: 2,
      title: "Website redesign",
      description: "Design and program new company website.",
      hours: "52.0",
      rate: "$100.00",
      price: "$5,200.00",
    },
    {
      id: 3,
      title: "Business cards",
      description: 'Design and production of 3.5" x 2.0" business cards.',
      hours: "12.0",
      rate: "$100.00",
      price: "$1,200.00",
    },
    {
      id: 4,
      title: "T-shirt design",
      description: "Three t-shirt design concepts.",
      hours: "4.0",
      rate: "$100.00",
      price: "$400.00",
    },
  ],
};
const activity = [
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 2,
    type: "edited",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:03",
  },
  {
    id: 3,
    type: "sent",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:24",
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 5,
    type: "viewed",
    person: { name: "Alex Curren" },
    date: "2d ago",
    dateTime: "2023-01-24T09:12",
  },
  {
    id: 6,
    type: "paid",
    person: { name: "Alex Curren" },
    date: "1d ago",
    dateTime: "2023-01-24T09:20",
  },
];
const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: SmileyIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: SmileySadIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: ThumbsUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XIcon,
    iconColor: "text-neutral-400",
    bgColor: "bg-transparent",
  },
];

export const Route = createFileRoute("/sample-page")({
  component: RouteComponent,
});

export function RouteComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selected, setSelected] = useState(moods[5]);

  return (
    <main>
      <header className="relative isolate pt-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute top-full left-16 -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
            <div
              className="aspect-1154/678 w-[72.125rem] bg-linear-to-br from-brand-primary to-brand-accent"
              style={{
                clipPath:
                  "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
              }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-neutral-900/5" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
            <div className="flex items-center gap-x-6">
              <img
                alt=""
                src="https://tailwindui.com/plus-assets/img/logos/48x48/tuple.svg"
                className="size-16 flex-none rounded-full ring-1 ring-neutral-900/10"
              />
              <h1>
                <div className="text-sm/6 text-neutral-500">
                  Invoice <span className="text-neutral-700">#00011</span>
                </div>
                <div className="mt-1 text-base font-semibold text-neutral-600">
                  Tuple, Inc
                </div>
              </h1>
            </div>
            <div className="flex items-center gap-x-4">
              <Button variant="plain">Copy URL</Button>
              <Button variant="plain">Edit</Button>
              <Button>Send</Button>
              {/* <Menu as="div" className="relative sm:hidden">
                  <MenuButton className="-m-3 block p-3">
                    <span className="sr-only">More</span>
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="size-5 text-neutral-500"
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-neutral-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <button
                        type="button"
                        className="block w-full px-3 py-1 text-left text-sm/6 text-neutral-600 data-focus:bg-neutral-50 data-focus:outline-hidden"
                      >
                        Copy URL
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-3 py-1 text-sm/6 text-neutral-600 data-focus:bg-neutral-50 data-focus:outline-hidden"
                      >
                        Edit
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu> */}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <div className="lg:col-start-3 lg:row-end-1">
            <h2 className="sr-only">Summary</h2>
            <Card>
              <dl className="flex flex-wrap">
                <div className="flex-auto pt-6 px-6">
                  <dt className="text-sm/6 font-semibold text-neutral-600">
                    Amount
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-neutral-600">
                    $10,560.00
                  </dd>
                </div>
                <div className="flex-none self-end px-6 pt-4">
                  <dt className="sr-only">Status</dt>
                  <dd>
                    <Tag color="success">Paid</Tag>
                  </dd>
                </div>
                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-surface-border px-6 pt-6">
                  <dt className="flex-none">
                    <span className="sr-only">Client</span>
                    <UserCircleIcon
                      aria-hidden="true"
                      weight="fill"
                      className="h-6 w-5 text-neutral-400"
                    />
                  </dt>
                  <dd className="text-sm/6 font-medium text-neutral-600">
                    Alex Curren
                  </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Due date</span>
                    <CalendarBlankIcon
                      aria-hidden="true"
                      weight="fill"
                      className="h-6 w-5 text-neutral-400"
                    />
                  </dt>
                  <dd className="text-sm/6 text-neutral-500">
                    <time dateTime="2023-01-31">January 31, 2023</time>
                  </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Status</span>
                    <CreditCardIcon
                      aria-hidden="true"
                      weight="fill"
                      className="h-6 w-5 text-neutral-400"
                    />
                  </dt>
                  <dd className="text-sm/6 text-neutral-500">
                    Paid with MasterCard
                  </dd>
                </div>
              </dl>
              <Divider inset="none" />
              <div className="flex">
                <Button variant="plain" inset="all">
                  Download receipt <span aria-hidden="true">&rarr;</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Invoice */}
          <Card
            gutter="none"
            className="-mx-4 p-12 sm:mx-0 lg:col-span-2 lg:row-span-2 lg:row-end-2"
          >
            <Title>Invoice</Title>
            <dl className="mt-6 grid grid-cols-1 text-sm/6 sm:grid-cols-2">
              <div className="sm:pr-4">
                <dt className="inline text-neutral-500">Issued on</dt>{" "}
                <dd className="inline text-neutral-700 font-medium">
                  <time dateTime="2023-23-01">January 23, 2023</time>
                </dd>
              </div>
              <div className="mt-2 sm:mt-0 sm:pl-4">
                <dt className="inline text-neutral-500">Due on</dt>{" "}
                <dd className="inline text-neutral-700 font-medium">
                  <time dateTime="2023-31-01">January 31, 2023</time>
                </dd>
              </div>
              <div className="mt-6 border-t border-surface-border pt-6 sm:pr-4">
                <dt className="font-semibold text-neutral-600">From</dt>
                <dd className="mt-2 text-neutral-500">
                  <span className="font-medium text-neutral-600">
                    Acme, Inc.
                  </span>
                  <br />
                  7363 Cynthia Pass
                  <br />
                  Toronto, ON N3Y 4H8
                </dd>
              </div>
              <div className="mt-8 sm:mt-6 sm:border-t border-surface-border sm:pt-6 sm:pl-4">
                <dt className="font-semibold text-neutral-600">To</dt>
                <dd className="mt-2 text-neutral-500">
                  <span className="font-medium text-neutral-600">
                    Tuple, Inc
                  </span>
                  <br />
                  886 Walter Street
                  <br />
                  New York, NY 12345
                </dd>
              </div>
            </dl>
            <table className="mt-16 w-full text-left text-sm/6 whitespace-nowrap">
              <colgroup>
                <col className="w-full" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="border-b border-surface-border text-neutral-600">
                <tr>
                  <th scope="col" className="px-0 py-3 font-semibold">
                    Projects
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pr-0 pl-8 text-right font-semibold sm:table-cell"
                  >
                    Hours
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pr-0 pl-8 text-right font-semibold sm:table-cell"
                  >
                    Rate
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-0 pl-8 text-right font-semibold"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-surface-border"
                    >
                      <td className="max-w-0 px-0 py-5 align-top">
                        <div className="truncate font-medium text-neutral-600">
                          {item.title}
                        </div>
                        <div className="truncate text-neutral-500">
                          {item.description}
                        </div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-neutral-700 tabular-nums sm:table-cell">
                        {item.hours}
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-neutral-700 tabular-nums sm:table-cell">
                        {item.rate}
                      </td>
                      <td className="py-5 pr-0 pl-8 text-right align-top text-neutral-700 tabular-nums">
                        {item.price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    scope="row"
                    className="px-0 pt-6 pb-0 font-normal text-neutral-700 sm:hidden"
                  >
                    Subtotal
                  </th>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden px-0 pt-6 pb-0 text-right font-normal text-neutral-700 sm:table-cell"
                  >
                    Subtotal
                  </th>
                  <td className="pt-6 pr-0 pb-0 pl-8 text-right text-neutral-600 tabular-nums">
                    {invoice.subTotal}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="pt-4 font-normal text-neutral-700 sm:hidden"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 text-right font-normal text-neutral-700 sm:table-cell"
                  >
                    Tax
                  </th>
                  <td className="pt-4 pr-0 pb-0 pl-8 text-right text-neutral-600 tabular-nums">
                    {invoice.tax}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="pt-4 font-semibold text-neutral-600 sm:hidden"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 text-right font-semibold text-neutral-600 sm:table-cell"
                  >
                    Total
                  </th>
                  <td className="pt-4 pr-0 pb-0 pl-8 text-right font-semibold text-neutral-600 tabular-nums">
                    {invoice.total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>

          <div className="lg:col-start-3">
            {/* Activity feed */}
            <h2 className="text-sm/6 font-semibold text-neutral-600">
              Activity
            </h2>
            <ul className="mt-6 space-y-6">
              {activity.map((activityItem, activityItemIdx) => {
                return (
                  <li key={activityItem.id} className="relative flex gap-x-4">
                    <div
                      className={cn(
                        activityItemIdx === activity.length - 1
                          ? "h-6"
                          : "-bottom-6",
                        "absolute top-0 left-0 flex w-6 justify-center"
                      )}
                    >
                      <div className="w-px bg-neutral-200" />
                    </div>
                    {activityItem.type === "commented" ? (
                      <>
                        <img
                          alt=""
                          src={activityItem.person.imageUrl}
                          className="relative mt-3 size-6 flex-none rounded-full bg-neutral-50"
                        />
                        <div className="flex-auto rounded-md p-3 ring-1 ring-neutral-200 ring-inset">
                          <div className="flex justify-between gap-x-4">
                            <div className="py-0.5 text-xs/5 text-neutral-500">
                              <span className="font-medium text-neutral-600">
                                {activityItem.person.name}
                              </span>{" "}
                              commented
                            </div>
                            <time
                              dateTime={activityItem.dateTime}
                              className="flex-none py-0.5 text-xs/5 text-neutral-500"
                            >
                              {activityItem.date}
                            </time>
                          </div>
                          <p className="text-sm/6 text-neutral-500">
                            {activityItem.comment}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                          {activityItem.type === "paid" ? (
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="size-6 text-accent-600"
                            />
                          ) : (
                            <div className="size-1.5 rounded-full bg-neutral-100 ring-1 ring-neutral-300" />
                          )}
                        </div>
                        <p className="flex-auto py-0.5 text-xs/5 text-neutral-500">
                          <span className="font-medium text-neutral-600">
                            {activityItem.person.name}
                          </span>{" "}
                          {activityItem.type} the invoice.
                        </p>
                        <time
                          dateTime={activityItem.dateTime}
                          className="flex-none py-0.5 text-xs/5 text-neutral-500"
                        >
                          {activityItem.date}
                        </time>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* New comment form */}
            <div className="mt-6 flex gap-x-3">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-6 flex-none rounded-full bg-neutral-50"
              />
              <form action="#" className="relative flex-auto">
                <div className="overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-neutral-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <label htmlFor="comment" className="sr-only">
                    Add your comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={2}
                    placeholder="Add your comment..."
                    className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-neutral-600 placeholder:text-neutral-400 focus:outline-none sm:text-sm/6"
                    defaultValue={""}
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
                  <div className="flex items-center space-x-5">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 flex size-10 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-500"
                      >
                        <PaperclipIcon aria-hidden="true" className="size-5" />
                        <span className="sr-only">Attach a file</span>
                      </button>
                    </div>
                    <div className="flex items-center">
                      {/* <Listbox value={selected} onChange={setSelected}>
                          <Label className="sr-only">Your mood</Label>
                          <div className="relative">
                            <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-500">
                              <span className="flex items-center justify-center">
                                {selected.value === null ? (
                                  <span>
                                    <FaceSmileIcon
                                      aria-hidden="true"
                                      className="size-5 shrink-0"
                                    />
                                    <span className="sr-only">
                                      Add your mood
                                    </span>
                                  </span>
                                ) : (
                                  <span>
                                    <span
                                      className={cn(
                                        selected.bgColor,
                                        "flex size-8 items-center justify-center rounded-full"
                                      )}
                                    >
                                      <selected.icon
                                        aria-hidden="true"
                                        className="size-5 shrink-0 text-white"
                                      />
                                    </span>
                                    <span className="sr-only">
                                      {selected.name}
                                    </span>
                                  </span>
                                )}
                              </span>
                            </ListboxButton>

                            <ListboxOptions
                              transition
                              className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base ring-1 shadow-sm ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:ml-auto sm:w-64 sm:text-sm"
                            >
                              {moods.map((mood) => {
                                return (
                                  <ListboxOption
                                    key={mood.value}
                                    value={mood}
                                    className="relative cursor-default bg-white px-3 py-2 select-none data-focus:bg-neutral-100"
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className={cn(
                                          mood.bgColor,
                                          "flex size-8 items-center justify-center rounded-full"
                                        )}
                                      >
                                        <mood.icon
                                          aria-hidden="true"
                                          className={cn(
                                            mood.iconColor,
                                            "size-5 shrink-0"
                                          )}
                                        />
                                      </div>
                                      <span className="ml-3 block truncate font-medium">
                                        {mood.name}
                                      </span>
                                    </div>
                                  </ListboxOption>
                                );
                              })}
                            </ListboxOptions>
                          </div>
                        </Listbox> */}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-neutral-600 ring-1 shadow-xs ring-neutral-300 ring-inset hover:bg-neutral-50"
                  >
                    Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
