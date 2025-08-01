/* eslint-disable import/no-default-export */
import { Card } from "@/components/ui/card";
import { Description } from "@/components/ui/fieldset";
import { Tag, TagButton } from "@/components/ui/tag";
import { Title } from "@/components/ui/text";
import type { Meta, StoryObj } from "@storybook/react-vite";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Content/Tag",
  component: Tag,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        <Tag color="primary">Default</Tag>
        <Tag color="neutral">Neutral</Tag>
        <Tag color="success">Success</Tag>
        <Tag color="warning">Warning</Tag>
        <Tag color="danger">Error</Tag>
      </div>
    );
  },
};

export const TagAsButton: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        <TagButton color="primary">Default</TagButton>
        <TagButton color="neutral">Neutral</TagButton>
        <TagButton color="success">Success</TagButton>
        <TagButton color="warning">Warning</TagButton>
        <TagButton color="danger">Error</TagButton>
      </div>
    );
  },
};
