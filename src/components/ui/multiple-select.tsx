import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFilter, VisuallyHidden } from "react-aria";
import {
  Button as AriaButton,
  ComboBox,
  type ComboBoxProps as ComboBoxPrimitiveProps,
  Input,
  type Key,
  ListBox,
  Popover,
  Tag as AriaTag,
  TagGroup,
  TagList,
} from "react-aria-components";
import { useListData } from "react-stately";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { useResizeObserver } from "@react-aria/utils";
import { Button } from "./button";
import { Description, useFieldController, useFieldProps } from "./fieldset";
import { composedInputStyles, type ControlOwnProps } from "./input";
import { pickerStyles } from "./picker";
import { cn } from "./utils";

/**
 * EXPERIMENTAL CORE COMPONENT .
 */

type SelectedKey = {
  id: Key;
  name: string;
  [key: string]: unknown;
};

export type SelectedValueRendererProps<T> = {
  selectedKeys: T;
  onRemove: (selectedKey: Key) => void;
};

/**
 * @internal
 */
type OwnProps = Omit<ControlOwnProps, "endEnhancer"> & {
  placeholder?: string;
};
type MultipleSelectProps<T extends object> = Omit<
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
> &
  OwnProps & {
    items?: Array<T>;
    onItemInserted?: (key: Key) => void;
    onItemCleared?: (key: Key) => void;
    renderEmptyState?: (inputValue: string) => React.ReactNode;
    renderSelectedValue?: React.FC<SelectedValueRendererProps<T>>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
    defaultSelectedKeys?: Array<Key>;
  };

export function MultipleSelect<T extends SelectedKey>({
  children,
  items = [],
  onItemCleared,
  onItemInserted,
  className,
  name,
  placeholder = "Select an option",
  adjoined: adjoinedConfig = "unset",
  renderEmptyState,
  // renderSelectedValue = SelectedKeysRenderer,
  // renderSelectedValue,
  startEnhancer,
  ...props
}: MultipleSelectProps<T>) {
  const field = useFieldProps();
  /**
   * EXPERIMENTAL
   * Might cause unstability by wrapping in ref.
   */
  const fieldControl = useRef(useFieldController()?.field).current;

  const initialSelectedKeys = props.defaultSelectedKeys ?? [];

  const selectedItems = useListData<T>({
    initialItems: items.filter((item) => initialSelectedKeys.includes(item.id)),
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
    [contains, selectedKeys],
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

  // const onRemove = (keys: Set<Key>) => {
  //   const key = keys.values().next().value;

  //   if (!key) {
  //     return;
  //   }

  //   selectedItems.remove(key);
  //   setFieldState({ inputValue: "", selectedKey: null });
  //   onItemCleared?.(key);
  //   fieldControl?.onChange(selectedItems.items.map((i) => i.id));
  // };

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
    [popLast, fieldState.inputValue],
  );

  const controlRef = useRef<HTMLDivElement>(null);
  const [controlWidth, setControlWidth] = useState(0);
  const onResize = useCallback(() => {
    if (controlRef.current) {
      setControlWidth(controlRef.current.offsetWidth);
    }
  }, []);

  useResizeObserver({
    ref: controlRef,
    onResize,
  });

  const { container, input, root, enhancerStart, enhancerEnd } =
    composedInputStyles({
      adjoined: adjoinedConfig,
    });

  return (
    <div
      ref={controlRef}
      data-slot="control"
      data-disabled={props.isDisabled}
      className={root({ className })}
    >
      <div className={container()}>
        {Boolean(startEnhancer) && (
          <div data-slot="enhancer" className={enhancerStart()}>
            {startEnhancer}
          </div>
        )}
        <SelectedKeysRenderer
          selectedKeys={selectedItems.items}
          onRemove={() => {
            //
          }}
        />
        <div>
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
            <div className="flex items-center">
              <Input
                placeholder={placeholder}
                className={input()}
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
              <AriaButton>
                <span data-slot="enhancer" className={cn(enhancerEnd())}>
                  <CaretDownIcon />
                </span>
              </AriaButton>
            </div>
            <Popover
              isNonModal
              triggerRef={controlRef}
              style={
                { "--trigger-width": `${controlWidth}px` } as CSSProperties
              }
            >
              <ListBox
                items={items}
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
                  //
                  pickerStyles().list({ className: "max-h-64" }),
                ])}
              >
                {children}
              </ListBox>
            </Popover>
          </ComboBox>
        </div>
      </div>
      {name && (
        <VisuallyHidden>
          <input
            hidden
            readOnly
            name={name}
            value={selectedItems.items.map((i) => i.id).join(",")}
          />
        </VisuallyHidden>
      )}
    </div>
  );
}

function SelectedKeysRenderer<T extends Array<SelectedKey>>({
  selectedKeys,
}: SelectedValueRendererProps<T>) {
  return (
    <TagGroup
      aria-label="Selected items"
      className="group has-[data-empty]:hidden"
      // onRemove={onRemove}
    >
      <TagList
        items={selectedKeys}
        className={cn(
          //
          "inline-flex flex-wrap gap-2 pr-2 empty:hidden",
          //
          "my-[calc(theme(spacing[2.5])-1px)] sm:my-[calc(theme(spacing[1.5])-1px)]",
        )}
      >
        {(item) => {
          return (
            <AriaTag
              className={cn([
                // base
                "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
                // Color
                "bg-neutral-600/10 text-neutral-700 group-data-hovered:bg-neutral-600/20 dark:bg-white/5 dark:text-neutral-400 dark:group-data-hovered:bg-white/10",
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
  );
}
