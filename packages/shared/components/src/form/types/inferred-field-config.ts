import type { ClassList, EmptyObject } from "@zenncore/types";
import type {
  Override,
  PartialFields,
  RequiredFields,
  StrictOmit,
  StrictOverride,
} from "@zenncore/types/utilities";
import type {
  BaseFieldShapeConfigMap,
  FieldShape,
  FieldShapePropsMap,
} from "./field-shape";

import type { z } from "zod";
import type { CoreType } from "./core-type";
import type { RefinedFieldProps } from "./refined-field-props";

type RefinedBaseFieldShapeConfig<S extends FieldShape> = Omit<
  BaseFieldShapeConfigMap[S],
  "constraint" | "optionLabels"
>;

type InferredFormControlClassListKey =
  | "root"
  | "label"
  | "message"
  | "description";

type InferredFormClassList<
  T extends RefinedFieldProps<FieldShapePropsMap[FieldShape]>,
> = ClassList<InferredFormControlClassListKey> & {
  input?: T extends { classList?: infer U } ? U : string;
};

type InferredCalendarProps<
  M extends FieldShapePropsMap,
  T extends z.ZodType,
> = PartialFields<
  Extract<
    RequiredFields<M["date"], "type">,
    {
      type: InferredCalendarType<T>;
    }
  >,
  "type"
>;

type InferredCalendarType<T extends z.ZodType> = NonNullable<
  Pick<
    Extract<BaseFieldShapeConfigMap["date"], { constraint: CoreType<T> }>,
    "type"
  >["type"]
>;

type InferredFieldConfigExtension<
  M extends FieldShapePropsMap,
  S extends FieldShape,
  T extends z.ZodType,
> = S extends "select" | "radio-group"
  ? {
      optionLabels?: Partial<Record<NonNullable<z.infer<T>>, string>>;
    }
  : S extends "date"
    ? InferredCalendarProps<M, T>
    : EmptyObject;

type RefinedFieldPropsWithExtension<
  M extends FieldShapePropsMap,
  S extends FieldShape,
  T extends z.ZodType,
> = StrictOverride<
  RefinedFieldProps<M[S]>,
  InferredFieldConfigExtension<M, S, T>
>;

type InferredConstraint<
  S extends FieldShape,
  T extends z.ZodType,
> = CoreType<T> extends BaseFieldShapeConfigMap[S]["constraint"]
  ? T
  : BaseFieldShapeConfigMap[S]["constraint"];

export type InferredFieldConfig<
  M extends FieldShapePropsMap,
  S extends FieldShape,
  T extends z.ZodType,
> = {
  shape: S;
  constraint: InferredConstraint<S, T>;
  defaultValue?: z.infer<T>;
  label?: string;
  labelHidden?: boolean;
  description?: string;
  classList?: InferredFormClassList<RefinedFieldPropsWithExtension<M, S, T>>;
} & RefinedBaseFieldShapeConfig<S> &
  // @ts-expect-error - TODO: fix this
  StrictOmit<RefinedFieldPropsWithExtension<M, S, T>, "classList">;
