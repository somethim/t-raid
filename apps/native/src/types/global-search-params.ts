export type GlobalSearchParams<T extends string = "id"> = {
  [key in T]: string;
};
