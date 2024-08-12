import {
  CreateEffectOptions,
  WritableSignal,
  untracked,
  effect,
  Signal,
} from '@angular/core';

export type WatchOptions = {
  immediate?: boolean;
} & CreateEffectOptions;

export function c3Watch<T>(
  signalValue: WritableSignal<T> | Signal<T>,
  callback?: (value: T, oldValue?: T) => void,
  options?: WatchOptions
): void {
  const initialValue = untracked(signalValue);
  let oldValue: T | undefined;

  if (options?.immediate) callback?.(initialValue);

  effect(() => {
    const value = signalValue();
    if (oldValue !== value) {
      callback?.(value, oldValue || initialValue);
      oldValue = value;
    }
  }, options);
}
