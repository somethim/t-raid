import type {
  FieldsVisibility,
  UseInferredForm,
} from "@zenncore/components/form";
import { cn } from "@zenncore/utils";
import { type ReactNode, createContext, useContext, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  type FormConfig,
  InferredFormControl,
  type InferredFormControlProps,
  type InferredFormFields,
  type UseInferredFormParams,
  useInferredForm,
} from ".";
import { Button, type ButtonProps } from "../button";

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
  clearOnSubmit?: boolean;
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
  clearOnSubmit = true,
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

  return (
    <InferredFormProvider {...(form as UseInferredForm)}>
      <form
        onSubmit={
          onSubmit &&
          form.handleSubmit((data) => {
            onSubmit(data, form);
          })
        }
        className={cn("flex flex-col gap-2.5", className)}
      >
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
        <div className={"flex w-full justify-end"}>{children}</div>
      </form>
    </InferredFormProvider>
  );
};

export const FormSubmitButton = ({
  variant = "default",
  color = "primary",
  children,
  ...props
}: ButtonProps) => {
  return (
    <Button {...props} variant={variant} color={color} type={"submit"}>
      {children}
    </Button>
  );
};
