import { isPlatformServer } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  PLATFORM_ID,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[c3OnDrag]',
  standalone: true,
})
export class C3OnDragDirective {
  public readonly c3OnDrag = output<{
    deltaX: number;
    deltaY: number;
  }>();
  public readonly c3OnDragStart = output<MouseEvent | TouchEvent>();
  public readonly c3OnDragEnd = output<MouseEvent | TouchEvent>();

  private _destroyRef = inject(DestroyRef);
  private isDragging = false;
  private lastX: number;
  private lastY: number;
  private preventClickSubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if (isPlatformServer(this._platformId)) return;

    this.registerEvent('mousedown', this.startDrag.bind(this));
    this.registerEvent('touchstart', this.startDrag.bind(this));
    this.registerEvent('mouseup', this.endDrag.bind(this), window);
    this.registerEvent('touchend', this.endDrag.bind(this));
    this.registerEvent('mousemove', this.drag.bind(this));
    this.registerEvent('touchmove', this.drag.bind(this));
  }

  private registerEvent(
    eventName: string,
    eventHandler: (event: MouseEvent | TouchEvent) => void = () => {},
    element: HTMLElement | Window = this.elementRef.nativeElement
  ) {
    return fromEvent<MouseEvent | TouchEvent>(element, eventName, {
      capture: true,
      passive: false,
    })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((event) => this.preventDefault(event))
      )
      .subscribe(eventHandler);
  }

  private preventDefault(
    event: MouseEvent | TouchEvent
  ): MouseEvent | TouchEvent {
    event.preventDefault();
    event.stopPropagation();
    return event;
  }

  private startDrag(event: MouseEvent | TouchEvent): void {
    this.preventClickSubscription = this.registerEvent(
      'click',
      console.log,
      window
    );
    this.isDragging = true;
    this.lastX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.lastY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    this.c3OnDragStart.emit(event);
  }

  private endDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = false;
    this.preventClickSubscription?.unsubscribe();
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
}
