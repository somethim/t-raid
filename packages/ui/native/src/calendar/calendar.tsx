"use client";

import { useControllableState } from "@zenncore/hooks";
import type { Override } from "@zenncore/types/utilities";
import { cva } from "class-variance-authority";
import { isBefore, isSameDay } from "date-fns";
import {
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
  placeholder?: string;
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

      if (isStartDateSelectionWithoutEndDate) {
        return { start: selectedDate, end: previousDateRange.start };
      }

      return {
        ...previousDateRange,
        [dateRangeExtensionType]: selectedDate,
      };
    });
  };

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
  onPick: (date: Date) => void;
} & Omit<DateRangeCalendarProps, "value" | "onChange">;

//TODO: Implement MultiPageDateRangeCalendar Airbnb style
// const MultiPageDateRangeCalendar = ({
//   value,
//   startYear,
//   endYear,
//   onPick,
//   ...props
// }: DateRangePrimitiveProps) => {
//   const [firstPageDate, setFirstPageDate] = useState(
//     normalizeCalendarValue(value?.start ?? new Date()),
//   );

//   const initLastPageDate =
//     value?.end && isSameMonth(firstPageDate, value.end)
//       ? addMonths(value.end, 1)
//       : addMonths(firstPageDate, 1);

//   const [lastPageDate, setLastPageDate] = useState(initLastPageDate);

//   const firstPageMonth = getMonth(firstPageDate);
//   const lastPageMonth = getMonth(lastPageDate);
//   const firstPageYear = getYear(firstPageDate);
//   const lastPageYear = getYear(lastPageDate);
//   const arePagesOnSameYear = isSameYear(firstPageDate, lastPageDate);

//   const isPreviousYearUnavailable =
//     subMonths(firstPageDate, 1).getFullYear() < startYear;
//   const isNextYearUnavailable =
//     addMonths(lastPageDate, 1).getFullYear() > endYear;

//   const handlePagesChange = (type: "forwards" | "backwards") => {
//     setFirstPageDate(
//       type === "forwards"
//         ? addMonths(firstPageDate, 1)
//         : subMonths(firstPageDate, 1),
//     );
//     setLastPageDate(
//       type === "forwards"
//         ? addMonths(lastPageDate, 1)
//         : subMonths(lastPageDate, 1),
//     );
//   };

//   return (
//     <View>
//       <View className={"mb-2 flex flex-row items-center gap-2"}>
//         <CalendarHeader
//           date={firstPageDate}
//           startYear={startYear}
//           endYear={lastPageYear}
//           endMonth={arePagesOnSameYear ? lastPageMonth : undefined}
//           showCalendarPageControls
//           onPageChange={setFirstPageDate}
//           className={"mb-0"}
//         />
//         -
//         <CalendarHeader
//           date={lastPageDate}
//           endYear={endYear}
//           startYear={firstPageYear}
//           startMonth={arePagesOnSameYear ? firstPageMonth + 1 : undefined}
//           showCalendarPageControls={false}
//           onPageChange={setLastPageDate}
//           className={"mb-0 pl-2"}
//         />
//         <View className={"ml-auto flex items-center gap-2"}>
//           <Button
//             size={"icon"}
//             variant={"soft"}
//             className={"ml-auto size-6 disabled:opacity-40"}
//             disabled={isPreviousYearUnavailable}
//             onPress={() => handlePagesChange("backwards")}
//           >
//             <ChevronLeftIcon className={"size-4"} />
//           </Button>
//           <Button
//             size={"icon"}
//             variant={"soft"}
//             className={"size-6 disabled:opacity-40"}
//             disabled={isNextYearUnavailable}
//             onPress={() => handlePagesChange("forwards")}
//           >
//             <ChevronRightIcon className={"size-4"} />
//           </Button>
//         </View>
//       </View>
//       <View>
//         <View className={"w-64 pr-4"}>
//           <CalendarBody
//             {...props}
//             value={value}
//             pageDate={firstPageDate}
//             onPick={onPick}
//             classList={{
//               cell: {
//                 startDate: cellVariants({ variant: "startDate" }),
//                 endDate: cellVariants({ variant: "endDate" }),
//                 singleDate: cellVariants({ variant: "singleDate" }),
//                 active: cellVariants(),
//               },
//             }}
//           />
//         </View>
//         <View className={"w-64 pl-4"}>
//           <CalendarBody
//             {...props}
//             pageDate={lastPageDate}
//             value={value}
//             onPick={onPick}
//             classList={{
//               cell: {
//                 startDate: cellVariants({ variant: "startDate" }),
//                 endDate: cellVariants({ variant: "endDate" }),
//                 singleDate: cellVariants({ variant: "singleDate" }),
//                 active: cellVariants(),
//               },
//             }}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

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
      // classList={{
      //   cell: {
      //     startDate: cellVariants({ variant: "startDate" }),
      //     endDate: cellVariants({ variant: "endDate" }),
      //     singleDate: cellVariants({ variant: "singleDate" }),
      //     active: cellVariants(),
      //   },
      // }}
    />
  );
};
