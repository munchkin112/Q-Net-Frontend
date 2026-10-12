import { useEffect, useState } from 'react';

function readStored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(`jagyeok:${key}`) || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStored(key, initial));

  useEffect(() => {
    localStorage.setItem(`jagyeok:${key}`, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
