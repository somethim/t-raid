import { useState } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AsyncFunction<TArgs extends any[] = any[], TReturn = any> = (
  ...args: TArgs
) => Promise<TReturn>;

type UseAsyncHandler<T extends AsyncFunction> = {
  isPending: boolean;
  handle: (...args: Parameters<T>) => Promise<ReturnType<T>>;
};

export const useAsyncHandler = <T extends AsyncFunction>(
  fn: T,
): UseAsyncHandler<T> => {
  const [isPending, setIsPending] = useState(false);

  const handle = async (...args: Parameters<T>) => {
    setIsPending(true);

    try {
      const response: ReturnType<T> = await fn(...args);
      return response;
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    handle: handle,
  };
};
