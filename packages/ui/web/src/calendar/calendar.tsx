"use client";

import { useControllableState } from "@zenncore/hooks";
import type { Override } from "@zenncore/types/utilities";
import { ChevronLeftIcon, ChevronRightIcon } from "@zennui/icons";
import { cva } from "class-variance-authority";
import {
  addMonths,
  addYears,
  endOfYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Button } from "../button";
import {
  CalendarBody,
  CalendarHeader,
  Calendar as CalendarPrimitive,
  type CalendarProps as CalendarPrimitiveProps,
} from "./calendar-primitive";

export type DateDateRange = { start?: Date; end?: Date };
export type DateStringRange = {
  start?: string;
  end?: string;
};

export type DateRange = DateDateRange | DateStringRange;

type CalendarBaseProps = {
  returnType?: "date" | "string";
} & Omit<CalendarPrimitiveProps, "onPick">;

export type SingleDateCalendarProps = Override<
  CalendarBaseProps,
  {
    value?: Date | string;
    defaultValue?: Date | string;
  }
> &
  (
    | {
        returnType?: "date";
        onChange?: (value?: Date) => void;
      }
    | {
        returnType: "string";
        onChange?: (value?: string) => void;
      }
  );

export type DateRangeCalendarProps = Override<
  CalendarBaseProps,
  {
    value?: DateRange;
    defaultValue?: DateRange;
    multiplePages?: boolean;
  }
> &
  (
    | {
        returnType?: "date";
        onChange?: (value?: DateDateRange) => void;
      }
    | {
        returnType: "string";
        onChange?: (value?: DateStringRange) => void;
      }
  );

export type CalendarProps =
  | ({
      type?: "date";
    } & SingleDateCalendarProps)
  | ({ type: "date-range" } & DateRangeCalendarProps);

export const Calendar = (props: CalendarProps) => {
  if (props.type === "date-range") return <DateRangeCalendar {...props} />;
  return <SingleDateCalendar {...props} />;
};

const cellVariants = cva(
  "mx-0 box-border w-[calc(100%/7)] rounded-none shadow-none",
  {
    variants: {
      variant: {
        activeMonday: "rounded-l-lg ",
        activeSunday: "rounded-r-lg",
        startDate: "rounded-l-lg",
        endDate: "rounded-r-lg",
        singleDate: "rounded-lg",
      },
    },
  },
);

const convertCalendarValue = (
  value: Date | DateRange | string,
): Date | DateDateRange => {
  if (typeof value === "string") return new Date(value);
  if (value instanceof Date) return value;

  return {
    start:
      typeof value.start === "string" ? new Date(value.start) : value.start,
    end: typeof value.end === "string" ? new Date(value.end) : value.end,
  };
};

export function normalizeCalendarValue(value: Date | string): Date;
export function normalizeCalendarValue(value: DateRange): DateDateRange;
export function normalizeCalendarValue(value?: Date | string): Date | undefined;
export function normalizeCalendarValue(
  value?: DateRange,
): DateDateRange | undefined;
export function normalizeCalendarValue(
  value: Date | string | undefined,
  fallback: Date | string,
): Date;
export function normalizeCalendarValue(
  value: DateRange | undefined,
  fallback: DateRange,
): DateDateRange;

export function normalizeCalendarValue(
  value?: Date | DateRange | string,
  fallback?: Date | DateRange | string,
) {
  if (value) return convertCalendarValue(value);

  return fallback ? convertCalendarValue(fallback) : undefined;
}

const DateRangeCalendar = ({
  value,
  multiplePages = true,
  defaultValue,
  returnType = "date",
  onChange,
  ...props
}: DateRangeCalendarProps) => {
  const [selectedDateRange, setSelectedDateRange] = useControllableState({
    prop: normalizeCalendarValue(value),
    defaultProp: normalizeCalendarValue(defaultValue),
    onChange: (value) => {
      if (!value) return onChange?.(undefined);

      onChange?.(
        (returnType === "date"
          ? value
          : {
              start: value.start?.toISOString(),
              end: value.end?.toISOString(),
            }) as DateDateRange & DateStringRange,
      );
    },
  });

  const formattedDateRange = selectedDateRange?.start
    ? {
        start: selectedDateRange?.start,
        end: selectedDateRange?.end ?? selectedDateRange?.start,
      }
    : undefined;

  const handleDateChange = (selectedDate: Date) => {
    setSelectedDateRange((previousDateRange) => {
      if (!previousDateRange) {
        return {
          start: selectedDate,
          end: undefined,
        };
      }

      const selectedDateRangeEdge = Object.entries(previousDateRange).find(
        ([_, edgeDate]) => isSameDay(edgeDate, selectedDate),
      )?.[0] as keyof DateRange | undefined;

      const isFirstSelectedDate = Object.entries(previousDateRange).every(
        ([_, value]) => value === undefined,
      );

      const selectedEdgeType =
        selectedDateRangeEdge ?? (isFirstSelectedDate ? "start" : undefined);

      const dateRangeExtensionType =
        previousDateRange.start &&
        isBefore(selectedDate, previousDateRange.start)
          ? "start"
          : "end";

      const areEdgesSameDate =
        previousDateRange.start &&
        previousDateRange.end &&
        isSameDay(previousDateRange.start, previousDateRange.end);

      if (areEdgesSameDate) {
        // date range is not selected (completed)
        return {
          ...previousDateRange,
          [dateRangeExtensionType]: selectedDate,
        };
      }

      if (selectedEdgeType) {
        const isStartDateSelected =
          selectedEdgeType === "start" && previousDateRange.start !== undefined;

        if (isStartDateSelected) {
          const shouldResetDateRange = !previousDateRange.end;

          if (shouldResetDateRange) return undefined;

          return {
            start: previousDateRange.start,
            end: undefined,
          };
        }

        if (isFirstSelectedDate) return { start: selectedDate, end: undefined };

        //  end date is selected

        const shouldResetDateRange = !previousDateRange.start;

        if (shouldResetDateRange) {
          return {
            start: undefined,
            end: undefined,
          };
        }

        return {
          start: previousDateRange.end,
          end: undefined,
        };
      }

      const isStartDateSelectionWithoutEndDate =
        dateRangeExtensionType === "start" && !previousDateRange?.end;

      if (isStartDateSelectionWithoutEndDate)
        return { start: selectedDate, end: previousDateRange.start };

      return {
        ...previousDateRange,
        [dateRangeExtensionType]: selectedDate,
      };
    });
  };

  if (multiplePages) {
    return (
      <MultiPageDateRangeCalendar
        value={formattedDateRange}
        onPick={handleDateChange}
        {...props}
      />
    );
  }
  return (
    <SinglePageDateRangeCalendar
      value={formattedDateRange}
      onPick={handleDateChange}
      {...props}
    />
  );
};

type DateRangePrimitiveProps = {
  value?: Required<DateDateRange>;
  startYear?: number;
  endYear?: number;
  onPick: (date: Date) => void;
} & Omit<DateRangeCalendarProps, "value" | "onChange">;

type MultiPageDateRangeCalendarPropsClassListKey = "";
type MultiPageDateRangeCalendarProps = {} & DateRangePrimitiveProps;

const MultiPageDateRangeCalendar = ({
  value,
  startDate = new Date("1940-01-01"), // startOfYear(new Date().setFullYear(1940)),
  endDate = endOfYear(addYears(new Date(), 1)),
  ...props
}: DateRangePrimitiveProps) => {
  const [firstPageDate, setFirstPageDate] = useState(
    startOfDay(value?.start ?? new Date()),
  );

  const initSecondPageDate =
    value?.end && isSameMonth(firstPageDate, value.end)
      ? addMonths(value.end, 1)
      : addMonths(firstPageDate, 1);

  const [secondPageDate, setLastPageDate] = useState(
    startOfDay(initSecondPageDate),
  );

  const normalizedStartDate = startOfDay(startDate);
  const normalizedEndDate = startOfDay(endDate);

  const isPreviousMonthAvailable = !isBefore(
    subMonths(firstPageDate, 1),
    normalizedStartDate,
  );
  const isNextMonthAvailable = !isAfter(
    addMonths(secondPageDate, 1),
    normalizedEndDate,
  );

  const handlePagesChange = (type: "forwards" | "backwards") => {
    setFirstPageDate(
      type === "forwards"
        ? addMonths(firstPageDate, 1)
        : subMonths(firstPageDate, 1),
    );
    setLastPageDate(
      type === "forwards"
        ? addMonths(secondPageDate, 1)
        : subMonths(secondPageDate, 1),
    );
  };

  return (
    <>
      <div className={"flex items-center gap-2"}>
        <CalendarHeader
          date={firstPageDate}
          startDate={normalizedStartDate}
          endDate={subMonths(secondPageDate, 1)}
          showCalendarPageControls={false}
          onPageChange={setFirstPageDate}
          className={"mb-0"}
        />
        -
        <CalendarHeader
          date={secondPageDate}
          startDate={addMonths(firstPageDate, 1)}
          endDate={normalizedEndDate}
          showCalendarPageControls={false}
          onPageChange={setLastPageDate}
          className={"mb-0 pl-2"}
        />
        <div className={"ml-auto flex items-center gap-2"}>
          <Button
            size={"icon"}
            variant={"soft"}
            disabled={!isPreviousMonthAvailable}
            className={"ml-auto size-6 disabled:opacity-40"}
            onClick={() => handlePagesChange("backwards")}
          >
            <ChevronLeftIcon className={"size-4"} />
          </Button>
          <Button
            size={"icon"}
            variant={"soft"}
            disabled={!isNextMonthAvailable}
            className={"size-6 disabled:opacity-40"}
            onClick={() => handlePagesChange("forwards")}
          >
            <ChevronRightIcon className={"size-4"} />
          </Button>
        </div>
      </div>
      <div className={"flex divide-x divide-border"}>
        <div className={"w-64 pr-4"}>
          <CalendarBody
            {...props}
            pageDate={firstPageDate}
            value={value}
            classList={{
              cell: {
                startDate: cellVariants({ variant: "startDate" }),
                endDate: cellVariants({ variant: "endDate" }),
                singleDate: cellVariants({ variant: "singleDate" }),
                active: cellVariants(),
              },
            }}
          />
        </div>
        <div className={"w-64 pl-4"}>
          <CalendarBody
            {...props}
            pageDate={secondPageDate}
            value={value}
            classList={{
              cell: {
                startDate: cellVariants({ variant: "startDate" }),
                endDate: cellVariants({ variant: "endDate" }),
                singleDate: cellVariants({ variant: "singleDate" }),
                active: cellVariants(),
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

const SinglePageDateRangeCalendar = (props: DateRangePrimitiveProps) => {
  return (
    <CalendarPrimitive
      {...props}
      classList={{
        cell: {
          startDate: cellVariants({ variant: "startDate" }),
          endDate: cellVariants({ variant: "endDate" }),
          singleDate: cellVariants({ variant: "singleDate" }),
          active: cellVariants(),
        },
      }}
    />
  );
};

const SingleDateCalendar = ({
  value,
  defaultValue,
  returnType = "date",
  onChange,
  ...props
}: SingleDateCalendarProps) => {
  const [selectedDate, setSelectedDate] = useControllableState({
    prop: normalizeCalendarValue(value),
    defaultProp: normalizeCalendarValue(defaultValue),
    onChange: (value) => {
      if (!value) return onChange?.(undefined);

      onChange?.(
        (returnType === "date" ? value : value.toISOString()) as Date & string,
      );
    },
  });

  const handleDatePick = (pickedDate: Date) => {
    const shouldResetDate = selectedDate
      ? isSameDay(pickedDate, selectedDate)
      : false;

    setSelectedDate(shouldResetDate ? undefined : pickedDate);
  };

  return (
    <CalendarPrimitive
      {...props}
      value={selectedDate}
      onPick={handleDatePick}
      classList={{
        cell: {
          startDate: cellVariants({ variant: "startDate" }),
          endDate: cellVariants({ variant: "endDate" }),
          singleDate: cellVariants({ variant: "singleDate" }),
          active: cellVariants(),
        },
      }}
    />
  );
};
