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
  if (options?.immediate) callback?.(untracked(signalValue));

  effect((onCleanup) => {
    const oldValue = signalValue();

    onCleanup(() => callback?.(untracked(signalValue), oldValue));
  }, options);
}
