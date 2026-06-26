import { useEffect, useState } from "react";

export default function useDebounce<T>(
  value: T,
  options?: { delay?: number; callback?: (value: T) => void },
) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
      options?.callback?.(value);
    }, options?.delay || 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, options?.delay]);

  return debounced;
}
