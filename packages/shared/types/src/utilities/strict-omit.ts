// Preserves type union, prevents the removal of non existing properties
export type StrictOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;
