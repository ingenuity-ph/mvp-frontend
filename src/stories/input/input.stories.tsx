/* eslint-disable import/no-default-export */
import { fn } from "storybook/test";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeadlessField, Label } from "@/components/ui/fieldset";
import { InputField, TextInput } from "@/components/ui/input";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Input",
  component: InputField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    placeholder: "Enter Name",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Username",
  },
};

export const WithDescription: Story = {
  args: {
    description: "This is a description",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    description: "This is a description",
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    readOnly: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: "Search User",
    startEnhancer: <MagnifyingGlassIcon />,
  },
};

export const WithStartEnhancer: Story = {
  args: {
    label: "Price",
    startEnhancer: (
      <div>
        <CurrencyDollarIcon />
      </div>
    ),
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex items-center justify-center gap-6">
        <Label className="shrink-0">Full name</Label>
        <TextInput name="full_name" className="max-w-48" />
      </HeadlessField>
    );
  },
};
