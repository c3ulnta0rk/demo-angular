export function coerceCssValue(val: number | string | undefined): string {
  if (typeof val === 'number') {
    return val + 'px';
  }
  return val ?? ''; // si c’est undefined ou string
}
