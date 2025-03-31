import { useControllableState } from "@zenncore/hooks";
import { cn } from "@zenncore/utils";
import { useRef } from "react";
import {
  Calendar,
  type DateRange,
  type DateRangeCalendarProps,
  type SingleDateCalendarProps,
} from "./calendar";
import {
  Drawer,
  DrawerContent,
  type DrawerProps,
  type DrawerRef,
  DrawerTrigger,
  type DrawerTriggerProps,
} from "./drawer";
import { inputRootVariants } from "./input";

export type DatePickerProps =
  | ({ type?: "date" } & SingleDatePickerProps)
  | ({ type: "date-range" } & DateRangePickerProps);

type DatePickerDrawerProps = Omit<DrawerProps, "snapAt">;

export const DatePicker = (props: DatePickerProps) => {
  return props.type === "date-range" ? (
    <DateRangePicker {...props} />
  ) : (
    <SingleDatePicker {...props} />
  );
};

type SingleDatePickerProps = SingleDateCalendarProps &
  Pick<
    DatePickerDrawerProps,
    "children" | "open" | "defaultOpen" | "scaleRoot" | "onOpenChange"
  >;

const SingleDatePicker = ({
  //drawerProps
  children,
  open,
  defaultOpen,
  scaleRoot,
  onOpenChange,
  //calendarProps
  className,
  classList,
  ...props
}: SingleDatePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onChange as (value: Date | string) => void,
  });
  const drawerRef = useRef<DrawerRef>(null);

  return (
    <Drawer
      ref={drawerRef}
      open={open}
      defaultOpen={defaultOpen}
      dynamicSnapPoint
      scaleRoot={scaleRoot}
      overDragResistanceFactor={20}
    >
      {children}
      <DrawerContent
        classList={{
          content: "pt-8 pb-16",
        }}
      >
        <Calendar
          returnType={"date"}
          {...props}
          type={"date"}
          value={value}
          onChange={(value?: Date | string) => {
            setValue(value);
            drawerRef.current?.close();
          }}
          className={cn("top-0 w-full", className, classList?.root)}
        />
      </DrawerContent>
    </Drawer>
  );
};

type DateRangePickerProps = DateRangeCalendarProps &
  Pick<
    DatePickerDrawerProps,
    "children" | "open" | "defaultOpen" | "scaleRoot" | "onOpenChange"
  >;

const DateRangePicker = ({
  //drawerProps
  children,
  open,
  defaultOpen,
  scaleRoot,
  onOpenChange,
  //calendarProps
  className,
  classList,
  ...props
}: DateRangePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onChange as (value: DateRange) => void,
  });

  return (
    <Drawer
      open={open}
      defaultOpen={defaultOpen}
      dynamicSnapPoint
      scaleRoot={scaleRoot}
      overDragResistanceFactor={20}
    >
      {children}
      <DrawerContent
        classList={{
          content: "pt-8 pb-16",
        }}
      >
        <Calendar
          {...props}
          type={"date-range"}
          onChange={setValue}
          value={value}
          defaultValue={value}
          className={cn("w-full", className, classList?.root)}
        />
      </DrawerContent>
    </Drawer>
  );
};

export type DatePickerTriggerProps = DrawerTriggerProps;

export const DatePickerTrigger = ({
  disabled,
  children,
  className,
  ...props
}: DatePickerTriggerProps) => {
  return (
    <DrawerTrigger
      {...props}
      disabled={disabled}
      className={cn(inputRootVariants({ disabled }), className)}
    >
      {children}
    </DrawerTrigger>
  );
};
