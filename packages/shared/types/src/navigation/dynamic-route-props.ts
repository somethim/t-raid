export type DynamicRouteProps<T extends string = "id"> = {
  params: Promise<Record<T, string>>;
};
