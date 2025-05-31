import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

export function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useDebounceCallBack = <T>(callback: (value: T) => void, delay: number) => {
  const callbackRef = useRef(callback);
  const debouncedFnRef = useRef<ReturnType<typeof debounce>>(undefined);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create debounced function only when delay changes
  if (!debouncedFnRef.current || debouncedFnRef.current.flush !== debounce(() => {}, delay).flush) {
    debouncedFnRef.current?.cancel();
    debouncedFnRef.current = debounce((value: T) => {
      callbackRef.current(value);
    }, delay);
  }

  useEffect(() => {
    return () => {
      debouncedFnRef.current?.cancel();
    };
  }, []);

  return debouncedFnRef.current;
};
