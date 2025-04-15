import type { DeepPartial } from "@zenncore/types/utilities";
import {
  type GenericValidator,
  type Infer,
  v,
  type Validator,
} from "convex/values";

// biome-ignore lint/suspicious/noExplicitAny: utility type
type PartialValidator<V extends Validator<any, "required", string>> =
  V extends Validator<infer S>
    ? Validator<Partial<S>>
    : Validator<Partial<V["type"]>>;

// biome-ignore lint/suspicious/noExplicitAny: utility type
export const partial = <V extends Validator<any, "required", string>>(
  validator: V,
): PartialValidator<V> => {
  const kind = validator.kind;
  switch (kind) {
    case "object": {
      return v.optional(
        v.object(
          Object.fromEntries(
            Object.entries(validator.fields).map(([key, validator]) => [
              key,
              v.optional(validator as GenericValidator),
            ]),
          ),
        ),
      ) as unknown as PartialValidator<V>;
    }
    case "union": {
      return v.optional(
        v.union(...validator.members.map((member) => partial(member))),
      ) as unknown as PartialValidator<V>;
    }
    default: {
      return v.optional(validator) as unknown as PartialValidator<V>;
    }
  }
};

// biome-ignore lint/suspicious/noExplicitAny: utility type
type DeepPartialValidator<V extends Validator<any, "required", string>> =
  V extends Validator<infer S>
    ? Validator<DeepPartial<S>>
    : Validator<DeepPartial<V["type"]>>;

// biome-ignore lint/suspicious/noExplicitAny: utility type
export const deepPartial = <V extends Validator<any, "required", string>>(
  validator: V,
): DeepPartialValidator<V> => {
  const kind = validator.kind;
  switch (kind) {
    case "object": {
      return v.optional(
        v.object(
          Object.fromEntries(
            Object.entries(validator.fields).map(([key, validator]) => [
              key,
              deepPartial(validator as GenericValidator),
            ]),
          ),
        ),
      ) as unknown as DeepPartialValidator<V>;
    }
    case "union": {
      return v.optional(
        v.union(...validator.members.map((member) => deepPartial(member))),
      ) as unknown as DeepPartialValidator<V>;
    }
    default: {
      return v.optional(validator) as unknown as DeepPartialValidator<V>;
    }
  }
};

type InferExtendedValidator<T extends Record<string, GenericValidator>> = {
  [K in keyof T]: Infer<T[K]>;
};

export type ExtendValidator<
  // biome-ignore lint/suspicious/noExplicitAny: utility type
  V extends Validator<any, "required", string>,
  T extends Record<string, GenericValidator>,
> =
  V extends Validator<infer S>
    ? Validator<S & InferExtendedValidator<T>>
    : Validator<V["type"] & InferExtendedValidator<T>>;

export const extend = <
  // biome-ignore lint/suspicious/noExplicitAny: utility type
  V extends Validator<any, "required", string>,
  T extends Record<string, GenericValidator>,
>(
  validator: V,
  extend: T,
): ExtendValidator<V, T> => {
  const kind = validator.kind;
  switch (kind) {
    case "object": {
      return v.object({
        ...validator.fields,
        ...extend,
      }) as unknown as ExtendValidator<V, T>;
    }
    case "union": {
      return v.union(
        // @ts-ignore
        validator.members.map((member) => extend(member, extend)),
      ) as ExtendValidator<V, T>;
    }
    default:
      throw new Error("Cannot extend from this validator");
  }
};

export type OmitValidator<
  // biome-ignore lint/suspicious/noExplicitAny: utility type
  V extends Validator<any, "required", string>,
  K extends keyof V["type"],
> =
  V extends Validator<infer S>
    ? Validator<Omit<S, K>>
    : Validator<Omit<V["type"], K>>;

export const omit = <
  // biome-ignore lint/suspicious/noExplicitAny: utility type
  V extends Validator<any, "required", string>,
  K extends keyof V["type"],
>(
  validator: V,
  keys: K[],
): OmitValidator<V, K> => {
  const kind = validator.kind;
  switch (kind) {
    case "object": {
      const object = Object.fromEntries(
        Object.entries(validator.fields).filter(
          ([key]) => !keys.includes(key as K),
        ),
      );
      return v.object(object) as OmitValidator<V, K>;
    }
    case "union": {
      return v.union(
        // @ts-ignore
        validator.members.map((member) => omit(member, keys)),
      ) as OmitValidator<V, K>;
    }
    default:
      throw new Error("Cannot omit from this validator");
  }
};

export type PickValidator<
  // biome-ignore lint/suspicious/noExplicitAny: utility type
  V extends Validator<any, "required", string>,
  K extends keyof V["type"],
> =
  V extends Validator<infer S>
    ? Validator<Pick<S, K>>
    : Validator<Pick<V["type"], K>>;

export const pick = <
  // biome-ignore lint/suspicious/noExplicitAny: utility type
  V extends Validator<any, "required", string>,
  K extends keyof V["type"],
>(
  validator: V,
  keys: K[],
): PickValidator<V, K> => {
  const kind = validator.kind;
  switch (kind) {
    case "object": {
      const object = Object.fromEntries(
        Object.entries(validator.fields).filter(([key]) =>
          keys.includes(key as K),
        ),
      );
      return v.object(object) as PickValidator<V, K>;
    }
    case "union": {
      return v.union(
        // @ts-ignore
        validator.members.map((member) => pick(member, keys)),
      ) as PickValidator<V, K>;
    }
    default:
      throw new Error("Cannot pick from this validator");
  }
};
