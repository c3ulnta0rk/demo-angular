import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CarouselItemDirective } from './carousel-item.directive';
import { AttachScrollDirective } from '../../modules/scrollDispatcher/attachScroll.directive';
import { C3OnDragDirective } from '../../directives/onDrag.directive';

/**
 * Carousel configuration interface
 */
export interface CarouselConfig {
  /** Enable auto-play mode */
  autoPlay?: boolean;
  /** Auto-play interval in milliseconds */
  interval?: number;
  /** Enable infinite loop */
  loop?: boolean;
  /** Show navigation dots */
  showDots?: boolean;
  /** Show navigation buttons */
  showButtons?: boolean;
  /** Number of items visible per view */
  itemsPerView?: number;
  /** Gap between items in pixels */
  gap?: number;
  /** Enable drag-and-drop navigation */
  dragEnabled?: boolean;
  /** Scroll behavior type */
  scrollBehavior?: 'smooth' | 'auto';
}

@Component({
  selector: 'c3-carousel',
  imports: [AttachScrollDirective, C3OnDragDirective],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c3-carousel',
    role: 'region',
    '[attr.aria-label]': '"Carousel"',
    '[attr.aria-live]': '"polite"',
    '[attr.aria-atomic]': '"true"',
    '[attr.tabindex]': '0',
    '[class.mobile]': 'isMobile()',
    '[class.tablet]': 'isTablet()',
    '[class.desktop]': 'isDesktop()',
  },
})
export class CarouselComponent implements OnInit {
  // Configuration inputs
  public showDots = input<boolean>(false);
  public showButtons = input<boolean>(true);
  public dragEnabled = input<boolean>(true);
  public scrollBehavior = input<'smooth' | 'auto'>('smooth');
  public gap = input<number>(24);
  public snapAlign = input<'start' | 'center' | 'end'>('start');
  public enableSnap = input<boolean>(true);

  // Responsive configuration
  public hideButtonsOnMobile = input<boolean>(true);
  public hideDotsOnMobile = input<boolean>(false);
  public touchGesturesOnly = input<boolean>(false);

  // Auto-play configuration
  public autoPlay = input<boolean>(false);
  public interval = input<number>(3000);
  public pauseOnHover = input<boolean>(true);
  public pauseOnFocus = input<boolean>(true);

  // Outputs
  public c3OnScrollEnd = output<void>();
  public indexChanged = output<number>();
  public slideStart = output<number>();
  public slideEnd = output<number>();
  public dragStart = output<void>();
  public dragEnd = output<void>();

  // Content and view queries
  public carouselItems = contentChildren(CarouselItemDirective, {
    descendants: true,
  });
  public scroller = viewChild('scroller', {
    read: ElementRef,
  });

  // Accessibility & State Signals
  public currentScrollPosition = signal<number>(0);
  public totalItems = computed(() => this.carouselItems().length);
  public currentIndex = computed(() => {
    const itemWidth = this.getItemWidth();
    if (itemWidth === 0) return 0;
    return Math.round(this.currentScrollPosition() / itemWidth);
  });

  public isAtStart = computed(() => this.currentScrollPosition() === 0);
  public isAtEnd = computed(() => {
    const scroller = this.scroller()?.nativeElement;
    if (!scroller) return false;
    const scrollPos = this.currentScrollPosition();
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    return scrollPos >= maxScroll - 1; // -1 for rounding tolerance
  });

  // Responsive state
  public isMobile = signal<boolean>(false);
  public isTablet = signal<boolean>(false);
  public isDesktop = signal<boolean>(true);
  public currentBreakpoint = signal<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Computed responsive behavior
  public shouldShowButtons = computed(() => {
    if (this.isMobile() && this.hideButtonsOnMobile()) return false;
    return this.showButtons();
  });

  public shouldShowDots = computed(() => {
    if (this.isMobile() && this.hideDotsOnMobile()) return false;
    return this.showDots();
  });

  // Auto-play state
  public isPlaying = signal<boolean>(false);
  public progress = signal<number>(0);

  private animationId: number | null = null;
  private isScrolling: boolean = false;
  private accumulatedDeltaX: number = 0;
  private initialScrollPosition: number = 0;
  private previousIndex: number = 0;

  // Inertia tracking
  private velocity: number = 0;
  private lastDragTime: number = 0;
  private inertiaAnimationId: number | null = null;

  // Responsive breakpoints
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;
  private resizeObserver: ResizeObserver | null = null;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Auto-play timer
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Monitor scroll position changes for accessibility announcements
    effect(() => {
      const index = this.currentIndex();
      const total = this.totalItems();
      this.announcePosition(index + 1, total);

      // Emit index changed event
      if (index !== this.previousIndex) {
        this.indexChanged.emit(index);
        this.previousIndex = index;
      }
    });
  }

  ngOnInit(): void {
    this.setupResponsive();

    // Start auto-play if enabled
    if (this.autoPlay()) {
      this.startAutoPlay();
    }
  }

  /**
   * Setup responsive behavior with ResizeObserver
   */
  private setupResponsive(): void {
    // Only run in browser
    if (!this.isBrowser) return;

    // Initial check
    this.checkBreakpoint();

    // Setup ResizeObserver for continuous monitoring
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkBreakpoint();
      });

      // Observe the carousel element
      const element = this.scroller()?.nativeElement?.parentElement;
      if (element) {
        this.resizeObserver.observe(element);
      }
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', () => this.checkBreakpoint());
    }
  }

  /**
   * Check current breakpoint and update signals
   */
  private checkBreakpoint(): void {
    if (!this.isBrowser) return;

    const width = window.innerWidth;

    if (width < this.MOBILE_BREAKPOINT) {
      this.isMobile.set(true);
      this.isTablet.set(false);
      this.isDesktop.set(false);
      this.currentBreakpoint.set('mobile');
    } else if (width < this.TABLET_BREAKPOINT) {
      this.isMobile.set(false);
      this.isTablet.set(true);
      this.isDesktop.set(false);
      this.currentBreakpoint.set('tablet');
    } else {
      this.isMobile.set(false);
      this.isTablet.set(false);
      this.isDesktop.set(true);
      this.currentBreakpoint.set('desktop');
    }
  }

  scrollItems(direction: number): void {
    const currentIndex = this.currentIndex();
    this.slideStart.emit(currentIndex);

    const itemWidth = this.getItemWidth();
    let padding = 0;

    // Prendre en compte le padding uniquement si le scroll est à 0
    if (this.currentScrollPosition() === 0 && window) {
      const scrollerStyle = window.getComputedStyle(
        this.scroller().nativeElement
      );
      padding = parseInt(scrollerStyle.paddingLeft, 10);
    }

    const newScrollPosition =
      this.currentScrollPosition() + (itemWidth + padding) * direction;

    this.scroller().nativeElement.scrollTo({
      left: newScrollPosition,
      behavior: this.scrollBehavior(),
    });

    this.updateScrollPositionSignal();

    // Emit slide end after animation
    setTimeout(() => {
      this.slideEnd.emit(this.currentIndex());
    }, 300);
  }

  /**
   * Keyboard navigation handler for accessibility
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const activeElement = document.activeElement;
    const isCarouselFocused =
      this.scroller()?.nativeElement.contains(activeElement) ||
      activeElement === this.scroller()?.nativeElement.parentElement;

    if (!isCarouselFocused) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (!this.isAtStart()) {
          this.scrollItems(-1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!this.isAtEnd()) {
          this.scrollItems(1);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.goToIndex(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToIndex(this.totalItems() - 1);
        break;
    }
  }

  /**
   * Navigate to specific index
   */
  goToIndex(index: number): void {
    if (index < 0 || index >= this.totalItems()) return;

    const itemWidth = this.getItemWidth();
    this.scroller().nativeElement.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });

    this.updateScrollPositionSignal();
  }

  onDragStart(): void {
    if (!this.dragEnabled()) return;

    // Cancel any ongoing inertia
    if (this.inertiaAnimationId !== null) {
      cancelAnimationFrame(this.inertiaAnimationId);
      this.inertiaAnimationId = null;
    }

    this.isScrolling = true;
    this.initialScrollPosition = this.scroller().nativeElement.scrollLeft;
    this.accumulatedDeltaX = 0;
    this.velocity = 0;
    this.lastDragTime = performance.now();
    this.dragStart.emit();
  }

  onDrag(event: { deltaX: number; deltaY: number }): void {
    if (!this.isScrolling || !this.dragEnabled()) return;

    // Calculate velocity for inertia
    const now = performance.now();
    const deltaTime = now - this.lastDragTime;

    if (deltaTime > 0) {
      this.velocity = event.deltaX / deltaTime;
    }

    this.lastDragTime = now;
    this.accumulatedDeltaX += event.deltaX;

    if (this.animationId === null) {
      this.animationId = requestAnimationFrame(() =>
        this.updateScrollPosition()
      );
    }
  }

  onDragEnd(): void {
    if (!this.dragEnabled()) return;

    this.isScrolling = false;
    this.dragEnd.emit();

    // Apply inertia effect
    if (Math.abs(this.velocity) > 0.5) {
      this.applyInertia(this.velocity);
    }
  }

  /**
   * Apply inertia effect after drag ends
   */
  private applyInertia(initialVelocity: number): void {
    const friction = 0.95;
    const minVelocity = 0.1;
    let velocity = initialVelocity;

    const animate = () => {
      // Stop if velocity is too small
      if (Math.abs(velocity) < minVelocity) {
        this.inertiaAnimationId = null;
        this.updateScrollPositionSignal();
        return;
      }

      const scroller = this.scroller()?.nativeElement;
      if (!scroller) {
        this.inertiaAnimationId = null;
        return;
      }

      // Check boundaries
      const currentScroll = scroller.scrollLeft;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;

      // Stop at boundaries
      if (
        (currentScroll <= 0 && velocity > 0) ||
        (currentScroll >= maxScroll && velocity < 0)
      ) {
        this.inertiaAnimationId = null;
        this.updateScrollPositionSignal();
        return;
      }

      // Apply velocity with friction
      scroller.scrollLeft = currentScroll - velocity * 16; // ~16ms per frame
      velocity *= friction;

      this.inertiaAnimationId = requestAnimationFrame(animate);
    };

    this.inertiaAnimationId = requestAnimationFrame(animate);
  }

  private updateScrollPosition(): void {
    if (!this.isScrolling) {
      this.animationId = null;
      return;
    }

    const newScrollPosition =
      this.initialScrollPosition - this.accumulatedDeltaX;
    this.scroller().nativeElement.scrollLeft = newScrollPosition;

    this.animationId = null;

    if (this.accumulatedDeltaX !== 0) {
      this.animationId = requestAnimationFrame(() =>
        this.updateScrollPosition()
      );
    }
  }

  /**
   * Update scroll position signal for reactive state management
   */
  private updateScrollPositionSignal(): void {
    const scroller = this.scroller()?.nativeElement;
    if (scroller) {
      this.currentScrollPosition.set(scroller.scrollLeft);
    }
  }

  /**
   * Get the width of a carousel item
   */
  private getItemWidth(): number {
    const firstItem = this.carouselItems().at(0);
    if (!firstItem) return 0;
    return firstItem._elementRef.nativeElement.offsetWidth || 0;
  }

  /**
   * Announce position change to screen readers
   */
  private announcePosition(current: number, total: number): void {
    // Screen readers will automatically announce changes due to aria-live="polite"
    // This method can be extended to update a visually hidden announcement element
    const announcement = `Item ${current} of ${total}`;
    console.debug('Carousel position:', announcement);
  }

  /**
   * Monitor scroll events to update position signal
   */
  onScroll(): void {
    this.updateScrollPositionSignal();
  }

  /**
   * Start auto-play mode
   */
  startAutoPlay(): void {
    if (!this.isBrowser) return;

    this.isPlaying.set(true);
    this.progress.set(0);

    // Clear existing intervals
    this.stopAutoPlay();

    // Progress bar animation
    const progressStep = 10; // Update every 10ms
    const steps = this.interval() / progressStep;
    let currentStep = 0;

    this.progressInterval = setInterval(() => {
      currentStep++;
      this.progress.set((currentStep / steps) * 100);
    }, progressStep);

    // Auto-advance slides
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
      this.progress.set(0);
      currentStep = 0;
    }, this.interval());
  }

  /**
   * Stop auto-play mode
   */
  stopAutoPlay(): void {
    this.isPlaying.set(false);
    this.progress.set(0);

    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Toggle auto-play state
   */
  toggleAutoPlay(): void {
    if (this.isPlaying()) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  /**
   * Navigate to next slide
   */
  private nextSlide(): void {
    if (this.isAtEnd()) {
      // Loop back to start
      this.goToIndex(0);
    } else {
      this.scrollItems(1);
    }
  }

  /**
   * Pause auto-play on mouse enter
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.autoPlay() && this.pauseOnHover() && this.isPlaying()) {
      this.stopAutoPlay();
    }
  }

  /**
   * Resume auto-play on mouse leave
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.autoPlay() && this.pauseOnHover() && !this.isPlaying()) {
      this.startAutoPlay();
    }
  }

  /**
   * Pause on focus (keyboard navigation)
   */
  @HostListener('focusin')
  onFocusIn(): void {
    if (this.autoPlay() && this.pauseOnFocus() && this.isPlaying()) {
      this.stopAutoPlay();
    }
  }

  /**
   * Resume on blur
   */
  @HostListener('focusout')
  onFocusOut(): void {
    if (this.autoPlay() && this.pauseOnFocus() && !this.isPlaying()) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.inertiaAnimationId !== null) {
      cancelAnimationFrame(this.inertiaAnimationId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // Stop auto-play
    this.stopAutoPlay();
  }
}
