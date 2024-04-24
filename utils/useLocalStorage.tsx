import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

export const useLocalStorage = <T extends string | string[]>(key: string, initialValue: T): [T | null, (value: T | ((val: T) => T)) => Promise<void>] => {
  const [storedValue, setStoredValue] = useState<T | null>(null);

  useEffect(() => {
    const fetchStoredValue = async () => {
      const item = await SecureStore.getItemAsync(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    };

    fetchStoredValue();
  }, [key, initialValue]);

  const setValue = async (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue!) : value;
    await SecureStore.setItemAsync(key, JSON.stringify(valueToStore));
    setStoredValue(valueToStore);
  };

  return [storedValue, setValue];
};