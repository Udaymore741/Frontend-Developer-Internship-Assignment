'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // localStorage unavailable or parse error — keep initialValue
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable — state still updates in memory
    }
  };

  return [storedValue, setValue];
}
