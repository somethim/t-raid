import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { useControllableState } from "@zenncore/hooks";
import type { ClassList } from "@zenncore/types";
import type { StrictOverride } from "@zenncore/types/utilities";
import { cn } from "@zenncore/utils";
import { format } from "date-fns";
import { type ComponentProps, createContext, useContext, useId } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { type DateRange, normalizeCalendarValue } from "../calendar";
import {
  DatePicker,
  type DatePickerProps,
  DatePickerTrigger,
} from "../date-picker";
import { Input, type InputProps } from "../input";
import { Label } from "../label";

export type FormProps = ComponentProps<typeof FormProvider> &
  ComponentProps<"form">;

// todo: merge FormProvider with html form

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

export type FormItemProps = ComponentProps<"div">;

export const FormItem = ({ className, ...props }: FormItemProps) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("flex flex-col gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
};

export type FormLabelProps = ComponentProps<typeof LabelPrimitive.Root>;

export const FormLabel = ({ className, ...props }: FormLabelProps) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-error", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};

export type FormControlProps = ComponentProps<typeof Slot>;

export const FormControl = ({ ...props }) => {
  const { error, formItemId, formDescriptionId, formMessageId, name } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};

export type FormDescriptionProps = ComponentProps<"p">;

export const FormDescription = ({
  className,
  ...props
}: FormDescriptionProps) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-foreground-dimmed", className)}
      {...props}
    />
  );
};

export type FormMessageProps = ComponentProps<"p">;

export const FormMessage = ({
  className,
  children,
  ...props
}: FormMessageProps) => {
  const { error: fieldError, formMessageId } = useFormField();
  let errorMessage = fieldError ? String(fieldError?.message) : children;

  if (typeof fieldError === "object" && !fieldError?.message) {
    // if field is object and has property errors
    for (const key in fieldError) {
      const fieldPropertyError = fieldError[key as keyof typeof fieldError];
      if (
        typeof fieldPropertyError === "object" &&
        "message" in fieldPropertyError
      ) {
        errorMessage = fieldPropertyError.message;
        break;
      }
    }
  }

  return (
    <p
      id={formMessageId}
      className={cn("h-3 font-body font-medium text-2xs text-error", className)}
      {...props}
    >
      {errorMessage ?? " "}
    </p>
  );
};

export type FormTextInputProps = InputProps & {
  type?: "text" | "number" | "password";
};

export const FormTextInput = ({
  value: valueProp,
  defaultValue,
  onChange,
  onTextChange,
  ...props
}: FormTextInputProps) => {
  const [value = "", setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
  });

  return (
    <Input
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onChange?.(event);
        onTextChange?.(event.target.value);
      }}
      {...props}
    />
  );
};

type FormDatePickerClassListKey = "trigger";
export type FormDatePickerProps = StrictOverride<
  DatePickerProps,
  {
    placeholder?: string;
    disabled?: boolean | DatePickerProps["disabled"];
    classList?: ClassList<FormDatePickerClassListKey>;
  }
> &
  (
    | {
        type?: "date";
        format?: (date: Date) => string;
      }
    | {
        type: "date-range";
        format?: (date: DateRange) => string;
      }
  );

export const FormDatePicker = ({
  format: formatContent,
  placeholder,
  disabled,
  className,
  classList,
  ...props
}: FormDatePickerProps) => {
  let formattedValue: string | undefined = undefined;

  const {
    root: rootClassName,
    trigger: triggerClassName,
    ...calendarClassList
  } = classList ?? {};

  switch (props.type) {
    case "date":
      formattedValue = props.value
        ? (formatContent?.(new Date(props.value)) ??
          format(props.value, "dd/MM/yyyy"))
        : undefined;
      break;
    case "date-range":
      formattedValue = props.value
        ? (formatContent?.(
            normalizeCalendarValue(props.value as Date & DateRange),
          ) ??
          `${props.value?.start ? format(props.value.start, "dd/MM/yyyy") : ""} ${props.value?.end || props.value?.start ? " - " : ""} ${props.value?.end ? format(props.value.end, "dd/MM/yyyy") : ""}`)
        : undefined;
      break;
    default:
      break;
  }

  return (
    <DatePicker
      {...props}
      {...(typeof disabled === "object" && {
        disabled,
      })}
      className={cn(className, rootClassName)}
      classList={calendarClassList}
    >
      <DatePickerTrigger
        disabled={disabled === true}
        className={cn(
          "text-foreground",
          !formattedValue && "text-foreground-dimmed/40",
          triggerClassName,
        )}
      >
        {formattedValue ?? placeholder}
      </DatePickerTrigger>
    </DatePicker>
  );
};
