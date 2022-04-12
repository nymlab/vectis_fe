import { useState } from "react";

export function useArrayState<T>(initialValue: T) {
  const [array, setArray] = useState<T[]>([initialValue]);

  function setItem(idx: number, value: T) {
    const newArray = [...array];
    newArray[idx] = value;
    setArray(newArray);
  }

  function pushItem(value?: T) {
    setArray([...array, value ?? initialValue]);
  }

  function removeItem(idx: number) {
    setArray([...array.slice(0, idx), ...array.slice(idx + 1)]);
  }

  return {
    array,
    setItem,
    pushItem,
    removeItem,
  };
}
