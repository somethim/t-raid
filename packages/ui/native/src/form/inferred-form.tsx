import type {
  FieldsVisibility,
  UseInferredForm,
} from "@zenncore/components/form";
import { cn } from "@zenncore/utils";
import { type ReactNode, createContext, useContext, useEffect } from "react";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Button, type ButtonProps } from "../button";
import {
  type FormConfig,
  type InferredFormFields,
  type UseInferredFormParams,
  useInferredForm,
} from "./config";
import { Form } from "./form";
import {
  InferredFormControl,
  type InferredFormControlProps,
} from "./inferred-form-field";

type InferredFormContextType = {
  fieldsVisibility?: FieldsVisibility;
};

const InferredFormContext = createContext<InferredFormContextType>({});
export const useInferredFormContext = () => useContext(InferredFormContext);

type InferredFormProviderProps = {
  children: ReactNode;
} & UseInferredForm;

export const InferredFormProvider = ({
  fieldsVisibility,
  children,
  ...form
}: InferredFormProviderProps) => {
  return (
    <Form {...form}>
      <InferredFormContext.Provider
        value={{
          fieldsVisibility,
        }}
      >
        {children}
      </InferredFormContext.Provider>
    </Form>
  );
};

export type InferredFormProps<T extends FormConfig> = {
  children?: ReactNode;
  config: T;
  onChange?: (
    data: InferredFormFields<T>,
    form: UseFormReturn<InferredFormFields<T>>,
  ) => void | Promise<void>;
  onSubmit?: (
    data: InferredFormFields<T>,
    form: UseFormReturn<InferredFormFields<T>>,
  ) => unknown | Promise<unknown>;
  className?: string;
} & Pick<
  NonNullable<UseInferredFormParams<T>[1]>,
  "defaultValues" | "fieldsVisibility" | "props"
>;

export const InferredForm = <T extends FormConfig>({
  children,
  config,
  props = {},
  defaultValues,
  fieldsVisibility,
  onChange,
  onSubmit,
  className,
}: InferredFormProps<T>) => {
  const form = useInferredForm<T>(config, {
    defaultValues,
    fieldsVisibility,
    ...props,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: should run only on mount
  useEffect(() => {
    if (!onChange) return;

    const { unsubscribe } = form.watch(() => {
      form.handleSubmit((data) => onChange(data, form))();
    });

    return unsubscribe;
  }, [onChange]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: form doesn't trigger useEffect
  useEffect(() => {
    if (!form.formState.isSubmitting) return;

    form.handleSubmit((data) => onSubmit?.(data, form))();
  }, [form.formState.isSubmitting, form.handleSubmit]);

  return (
    <InferredFormProvider {...(form as UseInferredForm)}>
      <View className={cn("gap-2.5", className)}>
        {Object.entries(config).map(([key, field]) => {
          type InferredFieldProps = InferredFormControlProps<
            typeof field.shape,
            typeof field.constraint
          >;

          return (
            <InferredFormControl
              key={key}
              {...(field as InferredFieldProps)}
              name={key}
            />
          );
        })}
        {children}
      </View>
    </InferredFormProvider>
  );
};

type FormSubmitButtonProps = ButtonProps;

export const FormSubmitButton = ({
  variant = "default",
  color = "primary",
  children,
  onPress,
  ...props
}: FormSubmitButtonProps) => {
  const { handleSubmit } = useFormContext();

  return (
    <Button
      {...props}
      variant={variant}
      color={color}
      onPress={(event) => {
        handleSubmit(() => {})();
        onPress?.(event);
      }}
    >
      {children}
    </Button>
  );
};
