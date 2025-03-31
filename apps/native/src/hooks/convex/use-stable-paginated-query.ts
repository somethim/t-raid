import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";

export const useStablePaginatedQuery = ((name, ...args) => {
  const result = usePaginatedQuery(name, ...args);
  const stored = useRef(result);

  // if new data is still loading, wait and do nothing
  // if data has finished loading, use the ref to store it
  if (result.status !== "LoadingMore") stored.current = result;

  return stored.current;
}) as typeof usePaginatedQuery;
