import {
  createContext,
  type PropsWithoutRef,
  useEffect,
  useId,
  useState,
} from "react";
import { mergeProps } from "react-aria";
import {
  ButtonContext,
  type ContextValue,
  DEFAULT_SLOT,
  GridList,
  GridListItem,
  Provider,
  useSlottedContext,
} from "react-aria-components";
import { FilePdfIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import * as fileUpload from "@zag-js/file-upload";
import {
  normalizeProps,
  // eslint-disable-next-line no-restricted-syntax/noPropTypes
  type PropTypes as ZagPropTypes,
  useMachine,
} from "@zag-js/react";
import { plainButtonStyles } from "./button";
import { FieldContext, FieldControllerContext } from "./fieldset";
import { surfaceStyles } from "./surface";
import { Text, textStyles } from "./text";
import { cn } from "./utils";

type Props = fileUpload.Props;

type Api = fileUpload.Api<ZagPropTypes>;
type ItemDetails = fileUpload.ItemProps &
  PropsWithoutRef<React.HTMLAttributes<HTMLElement>>;

const FileUploadContext = createContext<ContextValue<Api, HTMLElement>>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useFileUpload = () => useSlottedContext(FileUploadContext)!;

export function FileUpload({
  children,
  className,
  accept = ["application/pdf"],
  ...props
}: Partial<Props> & {
  className?: string;
  children?: React.ReactNode | ((item: ItemDetails) => React.ReactNode);
}) {
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;
  const field = useSlottedContext(FieldContext);
  const service = useMachine(fileUpload.machine, {
    accept,
    ...mergeProps(props, {
      onFileAccept(details) {
        fieldControl?.onChange(details.files[0]);
      },
      name: fieldControl?.name,
      disabled: fieldControl?.disabled,
    } satisfies Partial<Props>),
    id: useId(),
  });
  const api = fileUpload.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-slot="control"
      data-empty={api.acceptedFiles.length === 0 || undefined}
      className={cn([
        "flex flex-col gap-4",
        //
        className,
      ])}
    >
      <div
        data-slot="upload-container"
        className="rounded-surface border-brand-border p-surface flex min-h-32 flex-col items-center justify-center gap-2 border border-dashed bg-neutral-50 group-data-invalid/field:border-danger-500"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 p-1">
          <UploadSimpleIcon className="size-5" />
        </span>
        <div className="flex items-baseline gap-1.5">
          <div {...api.getDropzoneProps()}>
            <input
              {...api.getHiddenInputProps()}
              aria-label={field?.["aria-label"]}
              aria-describedby={field?.["aria-describedby"]}
              aria-labelledby={field?.["aria-labelledby"]}
            />
            <Text size="sm" className="font-medium">
              Drag your file(s) here or
            </Text>
          </div>
        </div>
        <button
          {...api.getTriggerProps()}
          className={cn([
            plainButtonStyles({ color: "neutral", inset: "left" }),
          ])}
        >
          Choose file(s)
        </button>
      </div>

      <GridList
        {...api.getItemGroupProps()}
        className="grid gap-2"
        items={api.acceptedFiles.map((file) => {
          return {
            ...api.getItemProps({ file }),
            file,
          };
        })}
      >
        {children === undefined
          ? (item) => {
              return <DefaultItem api={api} {...(item as ItemDetails)} />;
            }
          : children}
      </GridList>
    </div>
  );
}

export function AcceptedFiles({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode | ((item: ItemDetails) => React.ReactNode);
}) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = useSlottedContext(FileUploadContext)!;

  return (
    <GridList
      {...api.getItemGroupProps()}
      aria-label="Files Selected"
      className={className}
      items={api.acceptedFiles.map((file) => {
        return {
          ...api.getItemProps({ file }),
          file,
        };
      })}
    >
      {children === undefined
        ? (item) => {
            return <DefaultItem api={api} {...(item as ItemDetails)} />;
          }
        : children}
    </GridList>
  );
}

export function HeadlessFileUpload({
  children,
  className,
  accept = ["application/pdf"],
  fieldControlled = true,
  ...props
}: Partial<Props> & {
  className?: string;
  children: React.ReactNode;
  fieldControlled?: boolean;
}) {
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;
  const service = useMachine(fileUpload.machine, {
    accept,
    ...mergeProps(props, {
      onFileAccept(details) {
        if (!fieldControlled) {
          return;
        }
        const maxFiles = props.maxFiles ?? 1;

        if (maxFiles > 1) {
          fieldControl?.onChange(details.files);
        } else {
          fieldControl?.onChange(details.files[0]);
        }
      },
      validate(file, details) {
        const maxFiles = props.maxFiles ?? 1;
        const shouldAcceptMultiple = maxFiles > 1;
        const isAlreadySelected = details.acceptedFiles.some(
          (f) => f.name === file.name
        );

        if (isAlreadySelected && shouldAcceptMultiple) {
          return ["FILE_EXISTS"];
        }

        return null;
      },
      name: fieldControlled ? fieldControl?.name : undefined,
      disabled: fieldControlled ? fieldControl?.disabled : undefined,
    } satisfies Partial<Props>),
    id: useId(),
  });
  const api = fileUpload.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-slot="control"
      data-empty={api.acceptedFiles.length === 0 || undefined}
      className={cn("group", className)}
    >
      <Provider
        values={[
          [FileUploadContext, api],
          [
            ButtonContext,
            {
              slots: {
                [DEFAULT_SLOT]: {},
                "add-file": {
                  ...api.getTriggerProps(),
                  /**
                   * To prevent passing deprecrated prop.
                   */
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  onClick: undefined,
                  onBlur: undefined,
                  onFocus: undefined,
                  value: undefined,
                  formAction: undefined,
                  isDisabled: api.getTriggerProps().disabled,
                  onPress(e) {
                    /**
                     * Based from the source code the `currentTarget` is the only thing needed to make this work
                     * we just faked it to be able to adapt zagjs + RAC.
                     */
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    api.getTriggerProps().onClick({ currentTarget: e.target });
                  },
                },
              },
            },
          ],
        ]}
      >
        {children}
      </Provider>
    </div>
  );
}

export function Dropzone({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const field = useSlottedContext(FieldContext);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = useSlottedContext(FileUploadContext)!;

  return (
    <div
      data-slot="upload-container"
      className={cn([
        "rounded-surface border-brand-border p-surface flex min-h-32 flex-col items-center justify-center gap-2 border border-dashed bg-neutral-50 group-data-invalid/field:border-danger-500",
        //
        className,
      ])}
    >
      <div {...api.getDropzoneProps()}>
        <input
          {...api.getHiddenInputProps()}
          aria-label={field?.["aria-label"]}
          aria-describedby={field?.["aria-describedby"]}
          aria-labelledby={field?.["aria-labelledby"]}
        />
      </div>
      {children}
    </div>
  );
}

export function FileTrigger() {
  const api = useFileUpload();

  return (
    <button
      {...api.getTriggerProps()}
      className={cn([plainButtonStyles({ color: "neutral", inset: "left" })])}
    >
      Choose file(s)
    </button>
  );
}

export function ImagePreview({ file }: { file: File }) {
  const api = useFileUpload();
  const [url, setUrl] = useState("");

  useEffect(() => {
    api.createFileUrl(file, setUrl);
  }, [file, api]);

  if (!url) {
    return null;
  }

  return <img src={url} alt={file.name} className="size-full object-cover" />;
}

function DefaultItem({ api, ...props }: ItemDetails & { api: Api }) {
  return (
    <GridListItem
      className={cn([
        surfaceStyles({
          orientation: "horizontal",
          className: "[--gutter:--spacing(3)]",
        }),
      ])}
    >
      <div className="flex items-center gap-2">
        <span className="bg-brand-primary-50 text-brand-primary-800 size-8 rounded p-1">
          <FilePdfIcon />
        </span>
        <div
          {...api.getItemNameProps({ file: props.file })}
          className={cn([
            textStyles({ label: "sm", className: "font-medium" }),
          ])}
        >
          {props.file.name}
        </div>
      </div>
      <button
        {...api.getItemDeleteTriggerProps({ file: props.file })}
        className={cn([
          plainButtonStyles({ color: "danger", className: "ml-auto" }),
        ])}
      >
        Remove
      </button>
    </GridListItem>
  );
}
