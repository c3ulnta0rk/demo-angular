import { Directive, ElementRef, inject, input, Renderer2, ChangeDetectorRef, OnDestroy, DestroyRef } from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[c3Tooltip]',
  standalone: true,
})
export class C3TooltipDirective implements OnDestroy {
  public readonly content = input<string>('', {
    alias: 'c3Tooltip',
  });
  
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  
  private tooltipElement: HTMLElement | null = null;
  private mouseenterListener: (() => void) | null = null;
  private mouseleaveListener: (() => void) | null = null;
  private debounceTimer: number | null = null;
  private hideTimer: number | null = null;

  constructor() {
    this.attachEventListeners();
    this.destroyRef.onDestroy(() => this.ngOnDestroy());
  }

  private attachEventListeners(): void {
    const element = this.elementRef.nativeElement;
    
    this.mouseenterListener = this.renderer.listen(element, 'mouseenter', () => {
      this.handleMouseEnter();
    });

    this.mouseleaveListener = this.renderer.listen(element, 'mouseleave', () => {
      this.handleMouseLeave();
    });
  }

  private handleMouseEnter(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.showTooltip();
      this.cdr.markForCheck();
      this.debounceTimer = null;
    }, 300);
  }

  private handleMouseLeave(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.hideTimer = window.setTimeout(() => {
      this.hideTooltip();
      this.cdr.markForCheck();
      this.hideTimer = null;
    }, 300);
  }

  private showTooltip() {
    if (!this.tooltipElement) {
      this.createTooltipElement();
    }
    this.setTooltipContent();
    const position = this.calculateTooltipPosition();
    this.setPosition(position);
    this.showTooltipElement();
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      
      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.setStyle(this.tooltipElement, 'visibility', 'hidden');
        }
      }, 300);
    }
  }

  private createTooltipElement() {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(document.body, this.tooltipElement);
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '1000');
    this.renderer.setStyle(
      this.tooltipElement,
      'transition',
      'opacity 0.3s ease'
    );
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
  }

  private setTooltipContent() {
    if (this.tooltipElement) {
      this.tooltipElement.textContent = this.content();
    }
  }

  private calculateTooltipPosition(): TooltipPosition {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement!.getBoundingClientRect();
    const availableSpace = {
      top: rect.top,
      bottom: window.innerHeight - rect.bottom,
      left: rect.left,
      right: window.innerWidth - rect.right,
    };

    if (availableSpace.bottom >= tooltipRect.height) {
      return 'bottom';
    } else if (availableSpace.top >= tooltipRect.height) {
      return 'top';
    } else if (availableSpace.right >= tooltipRect.width) {
      return 'right';
    } else if (availableSpace.left >= tooltipRect.width) {
      return 'left';
    }
    return 'top';
  }

  private setPosition(position: TooltipPosition) {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement!.getBoundingClientRect();

    switch (position) {
      case 'bottom':
        this.renderer.setStyle(this.tooltipElement, 'top', `${rect.bottom}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${rect.left}px`);
        break;
      case 'top':
        this.renderer.setStyle(
          this.tooltipElement,
          'top',
          `${rect.top - tooltipRect.height}px`
        );
        this.renderer.setStyle(this.tooltipElement, 'left', `${rect.left}px`);
        break;
      case 'right':
        this.renderer.setStyle(this.tooltipElement, 'top', `${rect.top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${rect.right}px`);
        break;
      case 'left':
        this.renderer.setStyle(this.tooltipElement, 'top', `${rect.top}px`);
        this.renderer.setStyle(
          this.tooltipElement,
          'left',
          `${rect.left - tooltipRect.width}px`
        );
        break;
    }
  }

  private showTooltipElement(): void {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'visibility', 'visible');
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    }
  }

  ngOnDestroy(): void {
    if (this.mouseenterListener) {
      this.mouseenterListener();
    }
    
    if (this.mouseleaveListener) {
      this.mouseleaveListener();
    }

    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
    }

    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
