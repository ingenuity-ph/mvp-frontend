import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useFilter, VisuallyHidden } from "react-aria";
import {
  ComboBox,
  type ComboBoxProps as ComboBoxPrimitiveProps,
  Input,
  type Key,
  ListBox,
  Popover,
  Tag as AriaTag,
  TagGroup,
  TagList,
  useSlottedContext,
} from "react-aria-components";
import { useListData } from "react-stately";
import { X, XIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { Description, FieldContext, FieldControllerContext } from "./fieldset";
import { cn } from "./utils";

/**
 * EXPERIMENTAL CORE COMPONENT .
 */

interface SelectedKey {
  id: Key;
  name: string;
}

interface MultipleSelectProps<T extends object>
  extends Omit<
    ComboBoxPrimitiveProps<T>,
    | "children"
    | "validate"
    | "allowsEmptyCollection"
    | "inputValue"
    | "selectedKey"
    | "className"
    | "value"
    | "onSelectionChange"
    | "onInputChange"
  > {
  items: Array<T>;
  className?: string;
  onItemInserted?: (key: Key) => void;
  onItemCleared?: (key: Key) => void;
  renderEmptyState?: (inputValue: string) => React.ReactNode;
  tag?: (item: T) => React.ReactNode;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  defaultSelectedKeys?: Array<Key>;
}

export function MultipleSelect<T extends SelectedKey>({
  children,
  items,
  onItemCleared,
  onItemInserted,
  className,
  name,
  renderEmptyState,
  ...props
}: MultipleSelectProps<T>) {
  const field = useSlottedContext(FieldContext);
  /**
   * EXPERIMENTAL
   * Might cause unstability by wrapping in ref.
   */
  const fieldControl = useRef(
    useSlottedContext(FieldControllerContext)?.field
  ).current;

  const tagGroupIdentifier = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  const initialSelectedKeys =
    props.defaultSelectedKeys ?? fieldControl?.value ?? [];
  const initialSelectedItems = items.filter((item) =>
    initialSelectedKeys.includes(item.id)
  );

  const selectedItems = useListData<T>({
    initialItems: initialSelectedItems,
    initialSelectedKeys,
  });

  // Sync with external changes
  useEffect(() => {
    const updatedSelectedKeys = selectedItems.items.map((i) => i.id);

    if (
      JSON.stringify(fieldControl?.value) !==
      JSON.stringify(updatedSelectedKeys)
    ) {
      fieldControl?.onChange(updatedSelectedKeys);
    }
  }, [selectedItems.items, fieldControl]);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { contains } = useFilter({ sensitivity: "base" });
  const selectedKeys = selectedItems.items.map((i) => i.id);

  useEffect(() => {
    fieldControl?.onChange(selectedItems.items.map((item) => item.id));
  }, [selectedItems.items, fieldControl]);

  const filter = useCallback(
    (item: T, filterText: string) => {
      return !selectedKeys.includes(item.id) && contains(item.name, filterText);
    },
    [contains, selectedKeys]
  );

  const accessibleList = useListData({
    initialItems: items,
    filter,
  });

  const [fieldState, setFieldState] = useState<{
    selectedKey: Key | null;
    inputValue: string;
  }>({
    selectedKey: null,
    inputValue: "",
  });

  const onRemove = useCallback(
    (keys: Set<Key>) => {
      const key = keys.values().next().value;

      if (key) {
        selectedItems.remove(key);
        setFieldState({ inputValue: "", selectedKey: null });
        onItemCleared?.(key);
        fieldControl?.onChange(selectedItems.items.map((i) => i.id)); // 🔥 Ensure field updates
      }
    },
    [selectedItems, onItemCleared, fieldControl]
  );

  const onSelectionChange = (id: Key | null) => {
    if (!id) {
      return;
    }

    const item = accessibleList.getItem(id);

    if (!item || selectedKeys.includes(id)) {
      return;
    }

    if (!selectedKeys.includes(id)) {
      selectedItems.append(item);
      setFieldState({
        inputValue: "",
        selectedKey: id,
      });
      onItemInserted?.(id);
    }
    accessibleList.setFilterText("");
  };

  const onInputChange = (value: string) => {
    setFieldState((prev) => {
      return {
        inputValue: value,
        selectedKey: value === "" ? null : prev.selectedKey,
      };
    });

    accessibleList.setFilterText(value);
  };

  const popLast = useCallback(() => {
    if (selectedItems.items.length === 0) {
      return;
    }

    const endKey = selectedItems.items[selectedItems.items.length - 1];

    if (endKey.id) {
      selectedItems.remove(endKey.id);
      onItemCleared?.(endKey.id);
    }

    setFieldState({
      inputValue: "",
      selectedKey: null,
    });
  }, [selectedItems, onItemCleared]);

  const onKeyDownCapture = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && fieldState.inputValue === "") {
        popLast();
      }
    },
    [popLast, fieldState.inputValue]
  );

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.target.clientWidth);
      }
    });

    observer.observe(trigger);

    return () => {
      observer.unobserve(trigger);
    };
  }, []);

  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      data-slot="control"
      className={cn([
        // Basic layout
        "group relative isolate block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-control)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-control)] after:ring-transparent after:ring-inset sm:has-[:focus]:after:ring-2 sm:has-[:focus]:after:ring-blue-500",
        // Disabled state
        "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none",
        // Invalid state
        "before:has-[[data-invalid]]:shadow-danger-500/10",
      ])}
    >
      <div className={props.isDisabled ? "opacity-50" : ""}>
        <div
          ref={triggerRef}
          className={cn(
            // Basic layout
            "relative flex flex-wrap rounded-[var(--radius-control)]",
            // Horizontal padding
            "pl-[calc(theme(spacing[3.5])-1px)] sm:pl-[calc(theme(spacing.3)-1px)]",
            // Border
            "border-brand-border border has-[[data-hovered]]:border-zinc-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Invalid state
            "group-data-[invalid]/field:border-danger-500 group-data-[invalid]/field:hover:border-danger-500 group-data-[invalid]/field:dark:border-danger-500 group-data-[invalid]/field:hover:dark:border-danger-500",
            // Disabled state
            "disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15"
          )}
        >
          <TagGroup
            aria-label="Selected items"
            id={tagGroupIdentifier}
            className="group has-[data-empty]:hidden"
            onRemove={onRemove}
          >
            <TagList
              items={selectedItems.items}
              className={cn(
                //
                "inline-flex flex-wrap gap-2 pr-2 empty:hidden",
                //
                "my-[calc(theme(spacing[2.5])-1px)] sm:my-[calc(theme(spacing[1.5])-1px)]"
              )}
            >
              {(item) => {
                return (
                  <AriaTag
                    className={cn([
                      // base
                      "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
                      // Color
                      "bg-zinc-600/10 text-zinc-700 group-data-[hovered]:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-[hovered]:bg-white/10",
                    ])}
                  >
                    <span>{item.name}</span>
                    <Button
                      variant="unstyled"
                      slot="remove"
                      className="size-3 hover:opacity-50"
                    >
                      <XIcon data-slot="icon" />
                    </Button>
                  </AriaTag>
                );
              }}
            </TagList>
          </TagGroup>
          <ComboBox
            {...props}
            allowsEmptyCollection
            id={field?.id}
            aria-labelledby={field?.["aria-labelledby"]}
            aria-label="Available items"
            className="group peer relative flex flex-1"
            items={accessibleList.items}
            selectedKey={fieldState.selectedKey}
            inputValue={fieldState.inputValue}
            onSelectionChange={onSelectionChange}
            onInputChange={onInputChange}
          >
            <div
              className={cn(
                "inline-flex flex-1 flex-wrap items-center",
                className
              )}
            >
              <Input
                placeholder="Select an option"
                className={cn([
                  "flex-1 appearance-none py-1",
                  // Horizontal Padding
                  "pr-[calc(theme(spacing.10)-1px)] sm:pr-[calc(theme(spacing.9)-1px)]",
                  // Typography
                  "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
                  // Hide default focus styles
                  "outline-none",
                  // Vertical Padding
                  "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
                ])}
                onKeyDownCapture={onKeyDownCapture}
                onBlur={() => {
                  setFieldState({
                    inputValue: "",
                    selectedKey: null,
                  });
                  accessibleList.setFilterText("");
                  fieldControl?.onBlur();
                }}
              />

              <VisuallyHidden>
                <Button
                  slot="remove"
                  type="button"
                  aria-label="Remove"
                  ref={triggerButtonRef}
                >
                  <XIcon />
                </Button>
              </VisuallyHidden>
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2"
                tabIndex={-1}
                onClick={() => triggerButtonRef.current?.click()}
              >
                <svg
                  className="size-5 stroke-zinc-500 group-has-[[data-disabled]]:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  fill="none"
                >
                  <path
                    d="M5.75 10.75L8 13L10.25 10.75"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.25 5.25L8 3L5.75 5.25"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <Popover
              isNonModal
              style={{ width: `${width}px` }}
              triggerRef={triggerRef}
            >
              <ListBox
                selectionMode="multiple"
                renderEmptyState={() => {
                  return renderEmptyState ? (
                    renderEmptyState(fieldState.inputValue)
                  ) : (
                    <Description className="block p-3">
                      {fieldState.inputValue ? (
                        <>
                          No results found for:{" "}
                          <strong className="text-fg font-medium">
                            {fieldState.inputValue}
                          </strong>
                        </>
                      ) : (
                        "No options"
                      )}
                    </Description>
                  );
                }}
                className={cn([
                  // Base styles
                  "sm:max-w-auto isolate max-h-64 w-full max-w-(--trigger-width) min-w-[var(--trigger-width)] scroll-py-1 rounded-[var(--radius-control)] py-1 select-none",
                  // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                  "outline outline-transparent focus:outline-none",
                  // Handle scrolling when menu won't fit in viewport
                  "overflow-y-auto overscroll-contain",
                  // Popover background
                  "bg-white/95 backdrop-blur-xl dark:bg-zinc-800/75",
                  // Shadows
                  "shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset",
                ])}
              >
                {children}
              </ListBox>
            </Popover>
          </ComboBox>
        </div>
      </div>
      {name && (
        <input
          hidden
          readOnly
          name={name}
          value={selectedItems.items.map((i) => i.id).join(",")}
        />
      )}
    </div>
  );
}
