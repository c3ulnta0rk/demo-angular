import { computed, Directive, ElementRef, inject, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[c3AutoScroll]',
  standalone: true,
})
export class AutoScrollDirective {
  private readonly _container = inject(ElementRef);
  public readonly selectedIndex = signal<number | null>(null);

  public get container(): HTMLElement {
    return this._container.nativeElement;
  }

  constructor() {
    fromEvent<KeyboardEvent>(this.container, 'keydown').subscribe((event) =>
      this.onKeyDown(event)
    );

    fromEvent(this.container, 'click').subscribe(() => {
      const index = this.selectedIndex() ?? 0;
      this.select(index);
      this.container.focus();
    });
  }

  public readonly items = computed(
    () => this._container.nativeElement.children
  );

  public onKeyDown(event: KeyboardEvent) {
    console.log(event);
    event.preventDefault();
    if (event.key === 'ArrowUp') this.selectPrevious();
    else if (event.key === 'ArrowDown') this.selectNext();
  }

  public select(index: number): void {
    this.selectedIndex.set(index);
    this.scrollTo(index);
  }

  public selectNext(): void {
    const index = this.selectedIndex() ?? -1;
    this.select(Math.min(index + 1, this.items().length - 1));
  }

  public selectPrevious(): void {
    const index = this.selectedIndex() ?? 0;
    this.select(Math.max(index - 1, 0));
  }

  // This method scrolls the container to the specified index
  public scrollTo(index: number): void {
    if (!this._container) return;
    if (index === 0) {
      this._container.nativeElement.scrollTop = 0;
      return;
    }
    if (index === this.items().length - 1) {
      this._container.nativeElement.scrollTop =
        this._container.nativeElement.scrollHeight;
      return;
    }
    const item = this._container.nativeElement.children[index];
    const itemHeight = item.clientHeight;
    const itemOffset = item.offsetTop;
    const container = this._container.nativeElement;
    const containerHeight = container.clientHeight;
    const containerScrollTop = container.scrollTop;
    if (
      itemOffset >= containerScrollTop &&
      itemOffset + itemHeight <= containerScrollTop + containerHeight
    ) {
      return;
    }
    if (itemOffset < containerScrollTop) {
      this.scrollUpToItem(container, itemOffset - containerHeight + itemHeight);
    } else if (itemOffset + itemHeight > containerScrollTop + containerHeight) {
      this.scrollDownToItem(container, itemOffset, itemHeight, containerHeight);
    }
  }

  private scrollUpToItem(container: HTMLElement, itemOffset: number): void {
    container.scrollTop = itemOffset;
  }

  private scrollDownToItem(
    container: HTMLElement,
    itemOffset: number,
    itemHeight: number,
    containerHeight: number
  ): void {
    container.scrollTop = itemOffset - containerHeight + itemHeight;
  }
}
