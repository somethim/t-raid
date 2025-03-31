import type { ClassList } from "@zenncore/types";
import type { Tuple } from "@zenncore/types/utilities";
import { cn } from "@zenncore/utils";
import { DAYS, MONTHS, type Month } from "@zenncore/utils/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "@zennui/icons";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Button } from "../button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import type { DateDateRange, DateRange } from "./calendar";

type CalendarLocale = {
  days: Tuple<string, 7>;
  months: Tuple<string, 12>;
};

export const defaultLocale: CalendarLocale = {
  days: [...DAYS],
  months: [...MONTHS],
};

export type CalendarProps = {
  headerHidden?: boolean;
  locale?: CalendarLocale;
  onPick?: (date: Date) => void;
  className?: string;
  classList?: ClassList<CalendarBodyClassListKey>;
} & Pick<CalendarHeaderProps, "startDate" | "endDate"> &
  Pick<CalendarBodyProps, "value" | "disabled" | "onPick">;

export const Calendar = ({
  value,
  headerHidden,
  startDate,
  endDate,
  locale,
  disabled,
  onPick,
  className,
  classList,
}: CalendarProps) => {
  const [page, setPage] = useState(
    value ? (value instanceof Date ? value : value.start) : new Date(),
  );

  return (
    <div className={cn("w-64", className)}>
      {!headerHidden && (
        <CalendarHeader
          date={page}
          startDate={startDate}
          endDate={endDate}
          locale={locale}
          onPageChange={setPage}
        />
      )}
      <CalendarBody
        value={value}
        pageDate={page}
        disabled={disabled}
        locale={locale}
        onPick={onPick}
        classList={classList}
      />
    </div>
  );
};

export type CalendarHeaderProps = {
  date: Date;
  showCalendarPageControls?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  locale?: CalendarLocale;
  onPageChange: (page: Date) => void;
  className?: string;
};
export const CalendarHeader = ({
  date,
  startDate = new Date("1940-01-01"), // startOfYear(new Date().setFullYear(1940)),
  endDate = endOfYear(addYears(new Date(), 1)),
  showCalendarPageControls = true,
  locale,
  onPageChange,
  className,
}: CalendarHeaderProps) => {
  const normalizedDate = startOfDay(date);
  const startDateNormalized = startOfDay(startDate);
  const endDateNormalized = startOfDay(endDate);

  const startYear = startDateNormalized.getFullYear();
  const endYear = endDateNormalized.getFullYear();

  const monthNames = locale?.months ?? defaultLocale.months;
  const months = monthNames.filter((_, index) => {
    return isWithinInterval(new Date(normalizedDate).setMonth(index), {
      start: startDateNormalized,
      end: endDateNormalized,
    });
  });

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => i + startYear,
  );

  // const availableYears = years.filter(
  //   (year) => year >= startYear && year <= endYear,
  // );

  const isPreviousMonthAvailable = isWithinInterval(
    subMonths(normalizedDate, 1),
    {
      start: startDateNormalized,
      end: endDateNormalized,
    },
  );

  const isNextMonthAvailable = isWithinInterval(addMonths(normalizedDate, 1), {
    start: startDateNormalized,
    end: endDateNormalized,
  });

  return (
    <div className={cn("mb-2 flex items-center gap-2", className)}>
      <Select
        value={format(date, "MMMM").toUpperCase()}
        onValueChange={(month: Month) => {
          if (!month) return;

          const updatedMonthDate = new Date(date);
          updatedMonthDate.setMonth(monthNames.indexOf(month));

          onPageChange(updatedMonthDate);
        }}
      >
        <SelectTrigger variant={"underline"}>
          {format(date, "MMMM")}
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month} className={"capitalize"}>
              {month.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={format(date, "yyyy")}
        onValueChange={(year) => {
          const updatedYearDate = new Date(date);
          updatedYearDate.setFullYear(Number(year));

          onPageChange(updatedYearDate);
        }}
      >
        <SelectTrigger
          variant={"underline"}
          className={"flex items-center gap-1 border-border border-b pr-2"}
        >
          {format(date, "yyyy")}
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              className={"capitalize"}
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showCalendarPageControls && (
        <>
          <Button
            size={"icon"}
            variant={"soft"}
            className={"ml-auto size-6 disabled:opacity-40"}
            disabled={!isPreviousMonthAvailable}
            onClick={() => onPageChange(subMonths(date, 1))}
          >
            <ChevronLeftIcon className={"size-4"} />
          </Button>
          <Button
            size={"icon"}
            variant={"soft"}
            className={"size-6 disabled:opacity-40"}
            disabled={!isNextMonthAvailable}
            onClick={() => onPageChange(addMonths(date, 1))}
          >
            <ChevronRightIcon className={"size-4"} />
          </Button>
        </>
      )}
    </div>
  );
};

type CalendarDisabled = {
  before?: Date | string;
  after?: Date | string;
  weekDays?: number[];
  range?: Required<DateRange>;
};

const getIsDateSelectable = (disabled: CalendarDisabled, date: Date) => {
  const targetDate = startOfDay(date);

  if (disabled.after && isAfter(targetDate, startOfDay(disabled.after))) {
    return false;
  }
  if (disabled.before && isBefore(targetDate, startOfDay(disabled.before))) {
    return false;
  }
  if (disabled.weekDays?.includes(targetDate.getDay())) {
    return false;
  }
  if (
    disabled.range &&
    isWithinInterval(targetDate, {
      start: startOfDay(disabled.range.start),
      end: startOfDay(disabled.range.end),
    })
  ) {
    return false;
  }

  return true;
};

type CalendarBodyClassListKey =
  | "content"
  | {
      cell:
        | "startDate"
        | "endDate"
        | "default"
        | "active"
        | "activeMonday"
        | "activeSunday"
        | "edge"
        | "singleDate";
    };

export type CalendarBodyProps = {
  pageDate: Date;
  value?: Date | Required<DateDateRange>;
  disabled?: CalendarDisabled;
  locale?: CalendarLocale;
  onPick?: (date: Date) => void;
  className?: string;
  classList?: ClassList<CalendarBodyClassListKey>;
};

export const CalendarBody = ({
  pageDate,
  value,
  disabled,
  locale,
  onPick,
  className,
  classList,
}: CalendarBodyProps) => {
  const firstDayOfMonth = startOfMonth(pageDate);
  const lastDayOfMonth = endOfMonth(pageDate);

  const firstWeeksMondayOfMonth = startOfWeek(firstDayOfMonth);
  const lastWeeksSundayOfMonth = endOfWeek(lastDayOfMonth);

  const pageDays = eachDayOfInterval({
    start: firstWeeksMondayOfMonth,
    end: lastWeeksSundayOfMonth,
  });

  const dateRange = value
    ? {
        start: value instanceof Date ? value : value.start,
        end: value instanceof Date ? value : value.end,
      }
    : undefined;

  const startDate = dateRange?.start;
  const endDate = dateRange?.end;

  const days = locale?.days ?? defaultLocale.days;

  return (
    <div className={cn(className, "")}>
      <div className={"flex justify-between"}>
        {days.map((day) => (
          <div
            key={day}
            className={
              "flex aspect-square flex-1 items-center justify-center text-accent-dimmed text-xs"
            }
          >
            {day.slice(0, 2)}
          </div>
        ))}
      </div>
      <div className={"flex flex-wrap justify-between"}>
        {pageDays.map((pageDay) => {
          const isSelectableDate =
            !disabled || getIsDateSelectable(disabled, pageDay);

          const isSelectedDate =
            dateRange && isWithinInterval(pageDay, dateRange);

          const isEdgeDate = !![startDate, endDate].find(
            (edgeDate) => edgeDate && isSameDay(edgeDate, pageDay),
          );
          const isDifferentMonth = !isSameMonth(pageDate, pageDay);
          const isStartDate = startDate && isSameDay(startDate, pageDay);
          const isEndDate = endDate && isSameDay(endDate, pageDay);

          const areEdgesSameDate =
            startDate && endDate && isSameDay(startDate, endDate);

          const isSingleSelectedDate = areEdgesSameDate;

          const isMondaySelectedDate = isSelectedDate && pageDay.getDay() === 0;
          const isSundaySelectedDate = isSelectedDate && pageDay.getDay() === 6;

          return (
            <button
              key={pageDay.toISOString()}
              type={"button"}
              disabled={!isSelectableDate}
              onClick={() => onPick?.(pageDay)}
              className={cn(
                "h-8 min-w-[calc((100%/7)-theme(spacing.1))] flex-1 rounded-lg bg-transparent text-xs transition-colors duration-300 hover:bg-foreground/10",
                classList?.cell?.default,
                isDifferentMonth && "text-foreground-dimmed/30",
                isSelectedDate &&
                  cn(
                    "bg-primary/10 text-primary-rich hover:bg-primary/40 hover:text-white",
                    classList?.cell?.active,
                  ),
                isSelectedDate && isDifferentMonth && "opacity-50",
                isMondaySelectedDate && classList?.cell?.activeMonday,
                isSundaySelectedDate && classList?.cell?.activeSunday,
                isEdgeDate &&
                  cn("bg-primary/40 text-white", classList?.cell?.edge),
                isStartDate && classList?.cell?.startDate,
                isEndDate && classList?.cell?.endDate,
                isSingleSelectedDate && classList?.cell?.singleDate,
                !isSelectableDate && "pointer-events-none opacity-15",
              )}
            >
              {format(pageDay, "dd")}
            </button>
          );
        })}
      </div>
    </div>
  );
};
