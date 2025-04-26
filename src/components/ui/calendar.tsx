import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  type DateValue,
  Heading,
  useLocale,
} from "react-aria-components";
import { Button } from "./button";
import { textStyles } from "./text";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "./utils";
import { getLocalTimeZone, today } from "@internationalized/date";

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {}

export function Calendar<T extends DateValue>(props: CalendarProps<T>) {
  const now = today(getLocalTimeZone());

  return (
    <AriaCalendar {...props}>
      <CalendarHeader />
      <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0 [&_td]:py-0.5">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={({ isSelected, isDisabled }) =>
                cn(
                  "hover:bg-brand-primary-100 relative flex size-11 cursor-default items-center justify-center rounded-lg text-black tabular-nums outline-hidden sm:size-10 sm:text-sm/6 forced-colors:text-[ButtonText] forced-colors:outline-0",
                  // Selected
                  isSelected &&
                    "bg-brand-primary text-brand-primary-50 hover:bg-brand-primary/90 invalid:bg-danger pressed:bg-primary invalid:text-danger-fg forced-colors:bg-[Highlight] forced-colors:text-[Highlight] forced-colors:data-invalid:bg-[Mark]",
                  // Disabled
                  isDisabled && "text-zinc-300 forced-colors:text-[GrayText]",
                  date.compare(now) === 0 &&
                    "after:bg-brand-primary after:focus-visible:bg-brand-primary-50 selected:after:bg-brand-primary-50 after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                  props.className
                )
              }
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}

export function CalendarHeader() {
  const { direction } = useLocale();

  return (
    <header className="flex w-full items-center justify-between gap-1 px-1 pb-4">
      <Heading className={textStyles({ level: "label-md" })} />
      <div className="flex items-center gap-1">
        <Button slot="previous" size="sm" variant="outline" className="h-8">
          {direction === "rtl" ? (
            <CaretRight aria-hidden />
          ) : (
            <CaretLeft aria-hidden />
          )}
        </Button>
        <Button slot="next" size="sm" variant="outline" className="h-8">
          {direction === "rtl" ? (
            <CaretLeft aria-hidden />
          ) : (
            <CaretRight aria-hidden />
          )}
        </Button>
      </div>
    </header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => (
        <CalendarHeaderCell className="text-xs font-semibold text-gray-500">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
