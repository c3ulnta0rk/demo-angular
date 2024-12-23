export interface OverlayConfig<Component = unknown> {
  hasBackdrop?: boolean;
  backdropClass?: string;
  position?: 'center' | 'top-left' | { top?: number; left?: number };
  width?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  closeOnOutsideClick?: boolean;
  disposeOnNavigation?: boolean;
  inputs?: Partial<Record<keyof Component, unknown>>
}
