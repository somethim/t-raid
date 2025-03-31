import { makeUseQueryWithStatus } from "convex-helpers/react";
import { usePaginatedQuery, useQueries } from "convex/react";

// Do this once somewhere, name it whatever you want.
export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);
