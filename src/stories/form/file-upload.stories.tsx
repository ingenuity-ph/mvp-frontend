import { GridListItem } from "react-aria-components";
import { TrashIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, avatarStyles } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, Label } from "@/components/ui/fieldset";
import {
  AcceptedFiles,
  Dropzone,
  FileTrigger,
  FileUploadField,
  HeadlessFileUpload,
  ImagePreview,
} from "@/components/ui/file-upload";
import { WithTooltip } from "@/components/ui/tooltip";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/File Upload",
  component: FileUploadField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof FileUploadField>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const FormField: Story = {
  args: {
    label: "Upload Photos",
    description: "This photos will be used in your gallery.",
  },
};

export const TriggerOnly: Story = {
  render: () => {
    return (
      <Field>
        <Label>Photo</Label>
        <HeadlessFileUpload accept={["image/png"]} className="group">
          <div data-slot="control" className="flex items-center gap-2">
            <AcceptedFiles
              renderEmptyState={() => (
                <Avatar className="size-10" initials="A" />
              )}
            >
              {(item) => {
                return (
                  <GridListItem className="relative">
                    <ImagePreview
                      file={item.file}
                      className={avatarStyles({ className: "size-10" })}
                    />
                  </GridListItem>
                );
              }}
            </AcceptedFiles>

            <WithTooltip content="Remove selection">
              <Button
                slot="clear"
                color="danger"
                className="group-data-empty:hidden"
              >
                <TrashIcon />
              </Button>
            </WithTooltip>
            <Dropzone>
              <FileTrigger>
                <Button slot="select-file">Upload Photo</Button>
              </FileTrigger>
            </Dropzone>
          </div>
        </HeadlessFileUpload>
      </Field>
    );
  },
};
