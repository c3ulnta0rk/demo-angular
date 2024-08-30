import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  Signal,
  input,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'c3-text-rotator',
  standalone: true,
  templateUrl: './text-rotator.component.html',
  styleUrls: ['./text-rotator.component.scss'],
})
export class C3TextRotatorComponent implements OnInit, OnDestroy {
  public textList = input<string[]>([
    'Bonjour',
    'Angular',
    'RxJS',
    'Exemple',
    'Rotation',
    'Signals',
  ]);

  private currentIndexSignal = signal(0);
  private prevIndexSignal = signal(-1);

  currentText: Signal<string> = computed(
    () => this.textList()[this.currentIndexSignal()]
  );

  prevText: Signal<string | null> = computed(() => {
    const prevIndex = this.prevIndexSignal();
    return prevIndex >= 0 ? this.textList()[prevIndex] : null;
  });

  private subscription: Subscription | undefined;
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription = interval(3000).subscribe(() => {
        this.prevIndexSignal.set(this.currentIndexSignal());
        this.currentIndexSignal.update(
          (currentIndex) => (currentIndex + 1) % this.textList().length
        );
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
