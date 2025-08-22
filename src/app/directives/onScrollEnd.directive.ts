import { 
  Directive, 
  ElementRef, 
  inject, 
  output, 
  OnDestroy, 
  Renderer2,
  signal,
  effect,
  computed,
  DestroyRef
} from '@angular/core';

@Directive({
  selector: '[c3OnScrollEnd], [c3-on-scroll-end]',
  standalone: true,
})
export class C3OnScrollEndDirective implements OnDestroy {
  readonly c3OnScrollEnd = output<void>();
  
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  
  private readonly scrollPosition = signal(0);
  private readonly isAtEnd = computed(() => {
    const el = this.elementRef.nativeElement;
    const position = this.scrollPosition();
    return el.scrollHeight - position <= el.clientHeight + 1;
  });
  
  private scrollListener: (() => void) | null = null;
  private debounceTimer: number | null = null;
  
  constructor() {
    effect(() => {
      if (this.isAtEnd()) {
        this.handleScrollEnd();
      }
    });
    
    this.attachScrollListener();
    this.destroyRef.onDestroy(() => this.ngOnDestroy());
  }
  
  private attachScrollListener(): void {
    const element = this.elementRef.nativeElement;
    
    this.scrollListener = this.renderer.listen(element, 'scroll', (event: Event) => {
      this.handleScroll(event);
    });
  }
  
  private handleScroll(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = window.setTimeout(() => {
      this.scrollPosition.set(target.scrollTop);
      this.debounceTimer = null;
    }, 100);
  }
  
  private handleScrollEnd(): void {
    if (this.debounceTimer === null) {
      this.c3OnScrollEnd.emit();
    }
  }
  
  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
    
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
