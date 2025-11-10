import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DragItemState {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

@Injectable()
export class DragCoordinatorService {
  private containerElement: HTMLElement | null = null;
  private items = new Map<string, DragItemState>();
  private items$ = new BehaviorSubject<Map<string, DragItemState>>(new Map());

  setContainer(element: HTMLElement): void {
    this.containerElement = element;
  }

  getContainer(): HTMLElement | null {
    return this.containerElement;
  }

  registerItem(id: string, initialState: DragItemState): void {
    this.items.set(id, initialState);
    this.items$.next(this.items);
  }

  unregisterItem(id: string): void {
    this.items.delete(id);
    this.items$.next(this.items);
  }

  updateItem(id: string, state: Partial<DragItemState>): void {
    const current = this.items.get(id);
    if (current) {
      this.items.set(id, { ...current, ...state });
      this.items$.next(this.items);
    }
  }

  getItem(id: string): DragItemState | undefined {
    return this.items.get(id);
  }

  getBounds(itemWidth: number, itemHeight: number): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    if (!this.containerElement) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const containerRect = this.containerElement.getBoundingClientRect();

    return {
      minX: 0,
      maxX: containerRect.width - itemWidth,
      minY: 0,
      maxY: containerRect.height - itemHeight,
    };
  }
}
