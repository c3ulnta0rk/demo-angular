import { ComponentRef, Type } from '@angular/core';

function _getInputProperties<C>(component: Type<C>) {
  const inputs: string[] = [];
  const declaredInputs: Partial<Record<keyof C, string>> =
    component.prototype?.constructor['ɵcmp']?.declaredInputs;

  if (declaredInputs) inputs.push(...Object.keys(declaredInputs || {}));

  return inputs;
}

export function applyInputValues<C>(
  component: Type<C>,
  inputs: Partial<Record<keyof C, unknown>>,
  componentRef: ComponentRef<C>
) {
  const inputProperties = _getInputProperties(component);
  for (const key of inputProperties)
    if (inputs[key as keyof C])
      componentRef.setInput(key, inputs[key as keyof C]);

  return component;
}
