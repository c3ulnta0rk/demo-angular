import { Directive, ElementRef, inject, input, Renderer2, ChangeDetectorRef } from '@angular/core';
import { fromEvent, timer } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[c3Tooltip]',
  standalone: true,
})
export class C3TooltipDirective {
  /**
   * Directive to display a tooltip on an element.
   * Use the `c3Tooltip` attribute to specify the tooltip content.
   *
   * Example usage:
   * `<p c3Tooltip="Tooltip text">Hover over me!</p>`
   */
  public readonly content = input<string>('', {
    alias: 'c3Tooltip',
  });
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private tooltipElement: HTMLElement | null = null;
  private readonly destroy$ = fromEvent(
    this.elementRef.nativeElement,
    'destroy'
  );

  constructor() {
    fromEvent(this.elementRef.nativeElement, 'mouseenter')
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.showTooltip();
        this.cdr.markForCheck();
      });

    fromEvent(this.elementRef.nativeElement, 'mouseleave')
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.hideTooltip();
        this.cdr.markForCheck();
      });
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

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      timer(300)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.tooltipElement) {
            this.renderer.setStyle(this.tooltipElement, 'visibility', 'hidden');
          }
        });
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

  private showTooltipElement() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'visibility', 'visible');
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    }
  }
}
