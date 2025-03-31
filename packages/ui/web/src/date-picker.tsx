"use client";

import { useControllableState } from "@zenncore/hooks";
import { cn } from "@zenncore/utils";
import type { PropsWithChildren } from "react";
import {
  Calendar,
  type DateRange,
  type DateRangeCalendarProps,
  type SingleDateCalendarProps,
} from "./calendar";
import { inputRootVariants } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverTriggerProps,
} from "./popover";

export type DatePickerProps =
  | ({ type?: "date" } & SingleDatePickerProps)
  | ({ type: "date-range" } & DateRangePickerProps);

// todo: add disabled prop
export const DatePicker = (props: DatePickerProps) => {
  return (
    <Popover>
      {props.type === "date-range" ? (
        <DateRangePicker {...props} />
      ) : (
        <SingleDatePicker {...props} />
      )}
    </Popover>
  );
};

export type SingleDatePickerProps = PropsWithChildren<SingleDateCalendarProps>;

const SingleDatePicker = ({ children, ...props }: SingleDatePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onChange as (value: Date | string) => void,
  });

  return (
    <>
      {children}
      <PopoverContent className="flex flex-col gap-2">
        <Calendar {...props} type={"date"} onChange={setValue} value={value} />
      </PopoverContent>
    </>
  );
};

export type DateRangePickerProps = PropsWithChildren<DateRangeCalendarProps>;

const DateRangePicker = ({
  children,
  className,
  ...props
}: DateRangePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onChange as (value: DateRange) => void,
  });

  return (
    <>
      {children}
      <PopoverContent className="flex flex-col gap-2">
        <Calendar
          {...props}
          type={"date-range"}
          onChange={setValue}
          value={value}
          defaultValue={value}
        />
      </PopoverContent>
    </>
  );
};

export type DatePickerTriggerProps = PopoverTriggerProps;

export const DatePickerTrigger = ({
  disabled,
  children,
  className,
}: DatePickerTriggerProps) => {
  return (
    <PopoverTrigger
      className={cn(
        inputRootVariants({ disabled }),
        "w-fit min-w-64",
        className,
      )}
      disabled={disabled}
    >
      {children}
    </PopoverTrigger>
  );
};
