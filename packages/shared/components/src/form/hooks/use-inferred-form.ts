"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DefaultValues,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import type { z } from "zod";
import type { FormConfig, InferredFormFields } from "../types";
import {
  generateSchema,
  getConfigDefaultValues,
  getSchemaDefaultValues,
} from "../utils";

// type InferExtendReturnType<T extends FormConfig> = T extends {
//   extend: (schema: z.ZodSchema<InferredFormFields<T>>) => infer U;
// }
//   ? U extends CoreType<z.ZodSchema<InferredFormFields<T>>>
//     ? U
//     : never
//   : never;

export type FieldsVisibility<T extends FormConfig = FormConfig> = Partial<
  Record<
    keyof InferredFormFields<T>,
    ((data: InferredFormFields<T>) => boolean) | boolean
  >
>;

// todo: make the return schema here be wrapped with ZodEffects, Pipes and what not
export type UseInferredFormAdditionalParams<T extends FormConfig> = {
  defaultValues?: Partial<InferredFormFields<T>>;
  extend?: (
    schema: z.ZodSchema<InferredFormFields<T>>,
  ) => z.ZodSchema<InferredFormFields<T>>;
  fieldsVisibility?: FieldsVisibility<T>;
  props?: Partial<
    Omit<UseFormProps<InferredFormFields<T>>, "resolver" | "defaultValues">
  >;
};

export type UseInferredFormReturn<T extends FormConfig> = UseFormReturn<
  InferredFormFields<T>
> & {
  fieldsVisibility: FieldsVisibility<T>;
};

export type UseInferredForm = UseInferredFormReturn<FormConfig>;

export function useInferredForm<T extends FormConfig>(
  config: T,
  params: UseInferredFormAdditionalParams<T> & {
    fieldsVisibility: FieldsVisibility<T>;
  },
): UseInferredFormReturn<T>;

export function useInferredForm<T extends FormConfig>(
  config: T,
  params?: UseInferredFormAdditionalParams<T>,
): UseFormReturn<InferredFormFields<T>>;

export function useInferredForm<T extends FormConfig>(
  config: T,
  {
    defaultValues,
    extend,
    fieldsVisibility,
    props = {},
  }: UseInferredFormAdditionalParams<T> = {},
) {
  const schema = generateSchema(config);
  const extendedSchema = extend?.(schema) ?? schema;

  const form = useForm<InferredFormFields<T>>({
    resolver: zodResolver(extendedSchema, {}),
    defaultValues: {
      ...getSchemaDefaultValues(schema),
      ...getConfigDefaultValues(config),
      ...defaultValues,
    } as DefaultValues<InferredFormFields<T>>,
    shouldUnregister: true,
    ...props,
  });

  // console.log("render form");

  return { ...form, fieldsVisibility };
}

export type UseInferredFormParams<T extends FormConfig> = Parameters<
  typeof useInferredForm<T>
>;
