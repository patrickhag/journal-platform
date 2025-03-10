import { useState, useEffect } from 'react';

/**
 * useDebounce - Delays updating a value until after a specified delay.
 * @param value - The value to debounce (e.g., search input).
 * @param delay - The debounce delay in milliseconds (default: 500ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Cleanup previous timeout if value changes
    };
  }, [value, delay]);

  return debouncedValue;
}
