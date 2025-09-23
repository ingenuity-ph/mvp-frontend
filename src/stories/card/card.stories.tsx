/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@/components/ui/card";
import { Description } from "@/components/ui/fieldset";
import { Title } from "@/components/ui/text";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Surfaces/Card",
  component: Card,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Card>
        <Title>Example card</Title>
        <Description>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl.
        </Description>
      </Card>
    );
  },
};

export const Bleed: Story = {
  args: { bleed: true },
  render: (args) => {
    return (
      <Card {...args}>
        <Title>Example card</Title>
        <Description>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl.
        </Description>
      </Card>
    );
  },
};
