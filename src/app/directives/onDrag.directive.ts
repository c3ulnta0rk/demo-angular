import { isPlatformServer } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  output,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[c3OnDrag]',
  standalone: true,
})
export class C3OnDragDirective implements OnDestroy {
  public readonly c3OnDrag = output<{
    deltaX: number;
    deltaY: number;
  }>();
  public readonly c3OnDragStart = output<MouseEvent | TouchEvent>();
  public readonly c3OnDragEnd = output<MouseEvent | TouchEvent>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  private isDragging = false;
  private lastX: number;
  private lastY: number;
  private listeners: (() => void)[] = [];
  private preventClickListener: (() => void) | null = null;

  constructor() {
    if (isPlatformServer(this.platformId)) return;

    this.registerEvent('mousedown', this.startDrag.bind(this));
    this.registerEvent('touchstart', this.startDrag.bind(this));
    this.registerEvent('mouseup', this.endDrag.bind(this), window);
    this.registerEvent('touchend', this.endDrag.bind(this), window);
    this.registerEvent('mousemove', this.drag.bind(this), window);
    this.registerEvent('touchmove', this.drag.bind(this), window);

    this.destroyRef.onDestroy(() => this.ngOnDestroy());
  }

  private registerEvent(
    eventName: string,
    eventHandler: (event: MouseEvent | TouchEvent) => void,
    element: HTMLElement | Window = this.elementRef.nativeElement
  ): void {
    const listener = this.renderer.listen(
      element,
      eventName,
      (event: MouseEvent | TouchEvent) => {
        this.preventDefault(event);
        eventHandler(event);
      }
    );

    this.listeners.push(listener);
  }

  private preventDefault(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private startDrag(event: MouseEvent | TouchEvent): void {
    this.preventClickListener = this.renderer.listen(window, 'click', () => {});

    this.isDragging = true;
    this.lastX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.lastY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    this.c3OnDragStart.emit(event);
  }

  private endDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = false;

    if (this.preventClickListener) {
      this.preventClickListener();
      this.preventClickListener = null;
    }

    this.c3OnDragEnd.emit(event);
  }

  private drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    if (this.lastX === clientX && this.lastY === clientY) return;

    const deltaX = clientX - this.lastX;
    const deltaY = clientY - this.lastY;
    this.lastX = clientX;
    this.lastY = clientY;

    this.c3OnDrag.emit({ deltaX, deltaY });
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
    this.listeners = [];

    if (this.preventClickListener) {
      this.preventClickListener();
    }
  }
}
