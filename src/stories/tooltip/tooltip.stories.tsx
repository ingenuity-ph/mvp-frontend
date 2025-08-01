/* eslint-disable import/no-default-export */
import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/fieldset";
import { Tooltip } from "@/components/ui/tooltip";
import { PrinterIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TooltipTrigger } from "react-aria-components";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Surfaces/Tooltip",
  component: Tooltip,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => {
    return (
      <div className="">
        <Button>
          <PrinterIcon />
        </Button>
        <TooltipTrigger>
          <Button>
            <PrinterIcon />
          </Button>
          <Tooltip>
            <Description>Print Document</Description>
          </Tooltip>
        </TooltipTrigger>
      </div>
    );
  },
};
