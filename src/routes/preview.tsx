import { DialogTrigger } from "react-aria-components";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Calendar, RangeCalendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { CheckboxField, CheckboxGroup } from "@/components/ui/checkbox";
import type { Emphasis, ThemeColors } from "@/components/ui/constants";
import {
  DatePickerField,
  DateRangePickerField,
} from "@/components/ui/date-picker";
import { Dialog } from "@/components/ui/dialog";
import {
  Description,
  Field,
  FieldGroup,
  Label,
} from "@/components/ui/fieldset";
import { InputField, PasswordInput, TextInput } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { RadioField, RadioGroup } from "@/components/ui/radio";
import { Option, Select } from "@/components/ui/select";
import { SurfaceActions } from "@/components/ui/surface";
import { SwitchField } from "@/components/ui/switch";
import { Text, Title } from "@/components/ui/text";
import { TimePickerField } from "@/components/ui/time-picker";
import { Group } from "@/components/ui/utils";
import { Content, Footer, Header } from "@/components/ui/view";

export const Route = createFileRoute("/preview")({
  component: RouteComponent,
});

const roles = [
  { id: 1, name: "Admin", description: "Has full access to all resources" },
  {
    id: 2,
    name: "Editor",
    description: "Can edit content but has limited access to settings",
  },
  {
    id: 3,
    name: "Viewer",
    description: "Can view content but cannot make changes",
  },
  {
    id: 4,
    name: "Contributor",
    description: "Can contribute content for review",
  },
  {
    id: 5,
    name: "Guest",
    description: "Limited access, mostly for viewing purposes",
  },
];

const buttonVariants: Array<"solid" | "outline" | "plain"> = [
  "solid",
  "outline",
  "plain",
];
const emphasis: Array<Emphasis> = ["muted", "subtle", "bold"];
const themeColors: Array<ThemeColors> = [
  "primary",
  "neutral",
  "warning",
  "success",
  "danger",
  "info",
];

function RouteComponent() {
  return (
    <div className="p-4">
      <div className="grid gap-surface">
        <div className="mt-1 grid gap-surface sm:grid-cols-2 md:grid-cols-3">
          <Card className="items-center justify-center">
            <div className="grid grid-cols-3 gap-2">
              {themeColors.map((color) => {
                return buttonVariants.map((value) => {
                  return (
                    <Button key={color} color={color} variant={value}>
                      <WarningCircleIcon weight="fill" />
                      Submit
                    </Button>
                  );
                });
              })}
            </div>
          </Card>
          <Card className="items-center justify-center">
            <RadioGroup
              defaultValue="highSecurity"
              aria-label="Security settings"
            >
              {themeColors.map((color) => {
                return (
                  <RadioField
                    key={color}
                    color={color}
                    value={`highSecurity-${color}`}
                    label="High security"
                    description="Set all protections to maximum."
                  />
                );
              })}
            </RadioGroup>
          </Card>
          <Card className="items-center justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {themeColors.map((color) => {
                return (
                  <CheckboxField
                    defaultSelected
                    key={color}
                    color={color}
                    label="High security"
                    description="Encrypt all data at rest and in transit."
                  />
                );
              })}
            </div>
          </Card>
          <Card>
            <Header>
              <Title>Sign In</Title>
            </Header>
            <Content className="space-y-6">
              <form>
                <FieldGroup>
                  <InputField label="Email" placeholder="Enter your email" />
                  <Field>
                    <Label>Password</Label>
                    <PasswordInput placeholder="Enter your password" />
                  </Field>
                </FieldGroup>
              </form>
              <div className="flex items-center justify-between">
                <CheckboxField label="Remember me" />
                <Text>
                  <Link to="." className="font-medium hover:text-neutral-700">
                    Forgot password?
                  </Link>
                </Text>
              </div>
            </Content>
            <Footer>
              <Button className="w-full">Get Started</Button>
              <Text className="mt-8">
                Don&apos;t have an account?{" "}
                <Link to="." className="font-medium hover:text-neutral-700">
                  Sign Up
                </Link>
              </Text>
            </Footer>
          </Card>
          <Card className="items-center justify-center">
            <FieldGroup className="max-w-sm w-full">
              <Select
                aria-label="Select a role"
                placeholder="Select a role"
                items={roles}
              >
                {(item) => {
                  return (
                    <Option textValue={item.name}>
                      {/* <WarningCircleIcon /> */}
                      <Content>
                        <Label>{item.name}</Label>
                        <Description>{item.description}</Description>
                      </Content>
                    </Option>
                  );
                }}
              </Select>
              <Field>
                <Label>Country</Label>
                <Select aria-label="Select a role" placeholder="Select a role">
                  <Option textValue="Philippines">Philippines</Option>
                </Select>
                <Description>
                  We currently only ship to North America.
                </Description>
              </Field>
            </FieldGroup>
          </Card>
          <Card className="items-center justify-center">
            <DialogTrigger>
              <Button>Refund Payment</Button>
              <Dialog>
                <Header>
                  <Title>Refund Payment</Title>
                  <Description className="mt-2">
                    The refund will be reflected in the customer’s bank account
                    2 to 3 business days after processing.
                  </Description>
                </Header>
                <Content>
                  <form action="">
                    <FieldGroup>
                      <InputField label="Amount" placeholder="$0.00" />
                    </FieldGroup>
                  </form>
                </Content>
                <Footer className="mt-8">
                  <SurfaceActions>
                    <Button variant="plain" slot="close">
                      Cancel
                    </Button>
                    <Button>Refund</Button>
                  </SurfaceActions>
                </Footer>
              </Dialog>
            </DialogTrigger>
          </Card>
          <Card className="items-center justify-center">
            <DialogTrigger>
              <Button color="danger">Refund Payment</Button>
              <Dialog>
                <Header>
                  <Title>Refund Payment</Title>
                  <Description className="mt-2">
                    The refund will be reflected in the customer’s bank account
                    2 to 3 business days after processing.
                  </Description>
                </Header>
                <Footer className="mt-8">
                  <SurfaceActions>
                    <Button variant="plain" slot="close">
                      Cancel
                    </Button>
                    <Button color="danger">Refund me now</Button>
                  </SurfaceActions>
                </Footer>
              </Dialog>
            </DialogTrigger>
          </Card>
          <Card>
            <Label size="md" className="font-semibold">
              Team Members
            </Label>
            <div>
              <Description>
                Share this link with your team to give them access to your
                organization.
              </Description>
              <Group className="flex gap-3 mt-3">
                <TextInput
                  readOnly
                  value="https://example.com/teams/invite/eHGJEj12FHDKSi"
                />
                <Button variant="outline" className="shrink-0">
                  Copy Link
                </Button>
              </Group>
            </div>
          </Card>
          <Card className="items-center justify-center">
            <Calendar />
          </Card>
          <Card className="items-center justify-center">
            <DatePickerField
              label="Date of birth"
              className="max-w-3xs w-full"
            />
          </Card>
          <Card className="items-center justify-center">
            <Field>
              <Label>Select range</Label>
              <RangeCalendar />
            </Field>
          </Card>
          <Card className="items-center justify-center col-span-2">
            <Field>
              <Label>Select range</Label>
              <RangeCalendar visibleDuration={{ months: 2 }} />
            </Field>
          </Card>
          <Card className="items-center justify-center">
            <DateRangePickerField label="Duration of stay" />
          </Card>
          <Card className="items-center justify-center">
            <TimePickerField label="Time of arrival" />
          </Card>
          <Card>
            <RadioGroup
              defaultValue="highSecurity"
              aria-label="Security settings"
            >
              <RadioField
                value="highSecurity"
                label="High security"
                description="Set all protections to maximum."
              />
              <CheckboxGroup
                aria-label="Advanced Security Features"
                defaultValue={["encryption", "firewall"]}
                className="ml-6"
              >
                <CheckboxField
                  value="encryption"
                  label="Encryption"
                  description="Encrypt all data at rest and in transit."
                />
                <CheckboxField
                  value="firewall"
                  label="Firewall"
                  description="Enable network firewall."
                />
              </CheckboxGroup>

              <RadioField
                value="balancedSecurity"
                label="Balanced security"
                description="Balance between protection and performance."
              />
              <RadioField
                isDisabled
                value="lowSecurity"
                label="Low security"
                description="Minimal protection enabled."
              />
            </RadioGroup>
          </Card>
          <Card className="grid place-content-center">
            <SwitchField
              label="Location services"
              description="Apps can access your location"
            />
            <SwitchField
              label="Email notifications"
              description="You will receive email notifications"
            />
            <SwitchField
              isDisabled
              label="Email notifications"
              description="You will receive email notifications"
            />
          </Card>
        </div>
        <div className="grid gap-1 sm:grid-cols-2">
          {/* <AreaChartDemo />
          <BarChartDemo /> */}
        </div>
      </div>
    </div>
  );
}
