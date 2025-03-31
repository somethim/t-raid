import type { ClassList } from "@zenncore/types";
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
import { View, type ViewProps } from "react-native";
import { type DateRange, normalizeCalendarValue } from "../calendar";
import {
  DatePicker,
  type DatePickerProps,
  DatePickerTrigger,
} from "../date-picker";
import { Label, type LabelProps } from "../label";
import { Text } from "../text";
import { P, type ParagraphProps } from "../typography";

export type FormProps = ComponentProps<typeof FormProvider>;

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

export type FormItemProps = ViewProps;

export const FormItem = ({ className, ...props }: FormItemProps) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View className={cn("flex-col gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
};

export type FormLabelProps = LabelProps;

export const FormLabel = ({ className, ...props }: FormLabelProps) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      nativeID={formItemId}
      className={cn(error && "text-error", className)}
      {...props}
    />
  );
};

export type FormControlProps = ViewProps;

export const FormControl = ({ ...props }) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <View
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

export type FormDescriptionProps = ParagraphProps;

export const FormDescription = ({
  className,
  ...props
}: FormDescriptionProps) => {
  const { formDescriptionId } = useFormField();

  return (
    <P
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-foreground-dimmed", className)}
      {...props}
    />
  );
};

export type FormMessageProps = ParagraphProps;

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
    <P
      id={formMessageId}
      className={cn("font-body font-medium text-2xs text-error", className)}
      {...props}
    >
      {errorMessage ?? " "}
    </P>
  );
};

type FormDatePickerClassListKey = { trigger: "content" };
export type FormDatePickerProps = {
  placeholder?: string;
  disabled?: boolean;
  classList?: ClassList<FormDatePickerClassListKey>;
} & (
  | {
      type?: "date";
      format?: (date: Date) => string;
    }
  | {
      type: "date-range";
      format?: (date: DateRange) => string;
    }
) &
  DatePickerProps;

export const FormDatePicker = ({
  format: formatContent,
  placeholder,
  disabled,
  className,
  classList,
  ...props
}: FormDatePickerProps) => {
  const {
    root: rootClassName,
    trigger: triggerClassName,
    ...calendarClassList
  } = classList ?? {};
  let formattedValue: string | undefined = undefined;

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
      className={cn(className, rootClassName)}
      classList={calendarClassList}
      {...props}
    >
      <DatePickerTrigger
        disabled={disabled === true}
        className={triggerClassName?.root}
      >
        <Text
          className={cn(
            "text-foreground",
            !formattedValue && "text-foreground-dimmed/40",
            triggerClassName?.content,
          )}
        >
          {formattedValue ?? placeholder}
        </Text>
      </DatePickerTrigger>
    </DatePicker>
  );
};
