import {
  Component,
  OnDestroy,
  signal,
  computed,
  Signal,
  input,
  PLATFORM_ID,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
selector: 'c3-text-rotator',
  standalone: true,
  templateUrl: './text-rotator.component.html',
  styleUrls: ['./text-rotator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3TextRotatorComponent implements OnDestroy {
  public textList = input<string[]>([
    'Bonjour',
    'Angular',
    'Signals',
    'Exemple',
    'Rotation',
    'Zoneless',
  ]);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  
  private currentIndexSignal = signal(0);
  private prevIndexSignal = signal(-1);
  private intervalId: number | null = null;

  currentText: Signal<string> = computed(
    () => this.textList()[this.currentIndexSignal()]
  );

  prevText: Signal<string | null> = computed(() => {
    const prevIndex = this.prevIndexSignal();
    return prevIndex >= 0 ? this.textList()[prevIndex] : null;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.startRotation();
    }
    
    this.destroyRef.onDestroy(() => this.ngOnDestroy());
  }

  private startRotation(): void {
    this.intervalId = window.setInterval(() => {
      this.prevIndexSignal.set(this.currentIndexSignal());
      this.currentIndexSignal.update(
        (currentIndex) => (currentIndex + 1) % this.textList().length
      );
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
