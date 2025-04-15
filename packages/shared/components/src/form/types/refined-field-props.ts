type OmittableKeys =
  | "name"
  | "value"
  | "defaultValue"
  | "children"
  | "onChange"
  | "onBlur"
  | "onValueChange";

// type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
//   ? Omit<T, K>
//   : never;

export type RefinedFieldProps<T> = Omit<T, OmittableKeys>;
