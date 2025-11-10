import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  Renderer2,
  signal,
  input,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { DragCoordinatorService } from './drag-coordinator.service';
import { C3OnDragDirective } from './onDrag.directive';

@Directive({
  selector: '[c3DragItem]',
  standalone: true,
  hostDirectives: [C3OnDragDirective],
})
export class DragItemDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly coordinator = inject(DragCoordinatorService);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dragDirective = inject(C3OnDragDirective);

  // Input for item ID and initial position
  public readonly c3DragItemId = input<string>('');
  public readonly c3DragItemInitialX = input<number>(0);
  public readonly c3DragItemInitialY = input<number>(0);

  // Outputs for state changes
  public readonly positionChange = output<{ x: number; y: number }>();
  public readonly velocityChange = output<{ velocityX: number; velocityY: number }>();

  // Signals for position and velocity
  public readonly x = signal(0);
  public readonly y = signal(0);
  public readonly velocityX = signal(0);
  public readonly velocityY = signal(0);

  private lastMouseX = 0;
  private lastMouseY = 0;
  private offsetX = 0;
  private offsetY = 0;
  private lastTime = 0;
  private lastPosX = 0;
  private lastPosY = 0;
  private itemId: string = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.itemId = this.c3DragItemId() || `drag-item-${Math.random().toString(36).substr(2, 9)}`;

    // Set initial position from inputs
    const initialX = this.c3DragItemInitialX();
    const initialY = this.c3DragItemInitialY();

    this.x.set(initialX);
    this.y.set(initialY);
    this.lastPosX = initialX;
    this.lastPosY = initialY;

    // Register with coordinator
    this.coordinator.registerItem(this.itemId, {
      id: this.itemId,
      x: initialX,
      y: initialY,
      velocityX: 0,
      velocityY: 0,
    });

    // Set initial position style
    this.renderer.setStyle(this.elementRef.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', '0');
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', '0');
    this.updateTransform();

    // Track mouse position globally
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.handleMouseMove);
    }

    // Subscribe to drag events from c3OnDrag directive
    this.dragDirective.c3OnDragStart.subscribe(() => this.onDragStart());
    this.dragDirective.c3OnDrag.subscribe((event) => this.onDrag(event));
  }

  ngOnDestroy(): void {
    this.coordinator.unregisterItem(this.itemId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.handleMouseMove);
    }
  }

  private handleMouseMove = (e: MouseEvent): void => {
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  private onDragStart(): void {
    const container = this.coordinator.getContainer();
    if (!container) return;

    const elementRect = this.elementRef.nativeElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate offset between mouse and element top-left corner
    this.offsetX = this.lastMouseX - elementRect.left;
    this.offsetY = this.lastMouseY - elementRect.top;

    // Reset velocity tracking
    this.lastTime = performance.now();
    this.lastPosX = this.x();
    this.lastPosY = this.y();
    this.velocityX.set(0);
    this.velocityY.set(0);
  }

  private onDrag(event: { deltaX: number; deltaY: number }): void {
    const container = this.coordinator.getContainer();
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = this.elementRef.nativeElement.getBoundingClientRect();
    const bounds = this.coordinator.getBounds(elementRect.width, elementRect.height);

    // Calculate where the element would be based on mouse position
    const targetX = this.lastMouseX - containerRect.left - this.offsetX;
    const targetY = this.lastMouseY - containerRect.top - this.offsetY;

    // Clamp to bounds
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, targetX));
    const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, targetY));

    // Calculate velocity
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime > 0) {
      const deltaX = clampedX - this.lastPosX;
      const deltaY = clampedY - this.lastPosY;

      // Velocity in pixels per second
      const velX = (deltaX / deltaTime) * 1000;
      const velY = (deltaY / deltaTime) * 1000;

      this.velocityX.set(Math.round(velX));
      this.velocityY.set(Math.round(velY));

      this.lastTime = currentTime;
      this.lastPosX = clampedX;
      this.lastPosY = clampedY;

      this.velocityChange.emit({
        velocityX: this.velocityX(),
        velocityY: this.velocityY(),
      });
    }

    // Update position
    this.x.set(clampedX);
    this.y.set(clampedY);
    this.updateTransform();

    // Update coordinator
    this.coordinator.updateItem(this.itemId, {
      x: clampedX,
      y: clampedY,
      velocityX: this.velocityX(),
      velocityY: this.velocityY(),
    });

    // Emit position change
    this.positionChange.emit({ x: clampedX, y: clampedY });
  }

  private updateTransform(): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.x()}px, ${this.y()}px)`
    );
  }
}
