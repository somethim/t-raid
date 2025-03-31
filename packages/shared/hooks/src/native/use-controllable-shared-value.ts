import { useEffect } from "react";
import { type SharedValue, useSharedValue } from "react-native-reanimated";

type UseControllableSharedValueParams<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

type UseControllableSharedValueParams1<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

type UseControllableSharedValueParams2<T> = {
  value: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

type UseControllableSharedValueParams3<T> = {
  value: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

type UseControllableSharedValue = {
  // Order from most specific to least specific
  <T>(params: UseControllableSharedValueParams1<T>): SharedValue<T>;
  <T>(params: UseControllableSharedValueParams2<T>): SharedValue<T>;
  <T>(params: UseControllableSharedValueParams3<T>): SharedValue<T>;
  <T>(params: UseControllableSharedValueParams<T>): SharedValue<T | undefined>;
};

export const useControllableSharedValue = <T>({
  value: valueProp,
  defaultValue,
  onChange,
}:
  | UseControllableSharedValueParams<T>
  | UseControllableSharedValueParams1<T>
  | UseControllableSharedValueParams2<T>
  | UseControllableSharedValueParams3<T>): SharedValue<T | undefined> => {
  const uncontrolledValue = useSharedValue<T | undefined>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = (
    isControlled ? useSharedValue(valueProp) : uncontrolledValue
  ) as SharedValue<T | undefined>;

  useEffect(() => {
    if (!isControlled) return;
    uncontrolledValue.value = valueProp;
  }, [isControlled, valueProp, uncontrolledValue]);

  return value;
};
