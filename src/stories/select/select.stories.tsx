/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Description, HeadlessField, Label } from "@/components/ui/fieldset";
import { Option, Select, SelectField } from "@/components/ui/select";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Select",
  component: SelectField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: () => {
    return (
      <Select>
        <Option textValue="active">Active</Option>
        <Option textValue="paused">Paused</Option>
        <Option textValue="delayed">Delayed</Option>
        <Option textValue="canceled">Canceled</Option>
      </Select>
    );
  },
  args: {
    children: null,
  },
};

export const WithLabel: Story = {
  render: () => {
    return (
      <SelectField label="Status">
        <Option textValue="active">Active</Option>
        <Option textValue="paused">Paused</Option>
        <Option textValue="delayed">Delayed</Option>
        <Option textValue="canceled">Canceled</Option>
      </SelectField>
    );
  },
  args: {
    children: null,
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <SelectField
        label="Status"
        description="This will be visible to clients on the project."
      >
        <Option textValue="active">
          <Label>Active</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
        <Option textValue="paused">
          <Label>Paused</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
        <Option textValue="delayed">
          <Label>Delayed</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
        <Option textValue="canceled">
          <Label>Canceled</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
      </SelectField>
    );
  },
  args: {
    children: null,
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <SelectField
        disabled
        label="Status"
        description="This will be visible to clients on the project."
      >
        <Option textValue="active">Active</Option>
        <Option textValue="paused">Paused</Option>
        <Option textValue="delayed">Delayed</Option>
        <Option textValue="canceled">Canceled</Option>
      </SelectField>
    );
  },
  args: {
    children: null,
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex items-baseline justify-center gap-6">
        <Label>Status</Label>
        <Select name="status">
          <Option textValue="active">Active</Option>
          <Option textValue="paused">Paused</Option>
          <Option textValue="delayed">Delayed</Option>
          <Option textValue="canceled">Canceled</Option>
        </Select>
      </HeadlessField>
    );
  },
  args: {
    children: null,
  },
};
