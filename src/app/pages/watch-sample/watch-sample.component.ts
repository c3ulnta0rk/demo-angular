import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { c3Watch } from '../../utils/watch';
import { SnackbarService } from '../../modules/snackbar/snackbar.service';
import { SnackbarModule } from '../../modules/snackbar/snackbar.module';

@Component({
    selector: 'c3-watch-sample',
    imports: [CommonModule, SnackbarModule],
    templateUrl: './watch-sample.component.html',
    styleUrl: './watch-sample.component.scss'
})
export class WatchSampleComponent {
  public readonly counter = signal(0);
  private readonly snackbarService = inject(SnackbarService);

  constructor() {
    c3Watch(this.counter, (value) => {
      console.log('counter:', value);
    });

    setTimeout(() => {
      this.snackbarService.open(
        'Open the console to see the counter value changes in real-time (and skip the initialValue)'
      );
    }, 1000);
  }

  public increment(): void {
    this.counter.update((value) => value + 1);
  }

  public decrement(): void {
    this.counter.update((value) => value - 1);
  }
}
