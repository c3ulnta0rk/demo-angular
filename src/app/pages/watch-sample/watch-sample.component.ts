import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { watch } from '../../utils/watch';
import { SnackbarService } from '../../components/snackbar/snackbar.service';

@Component({
  selector: 'c3-watch-sample',
  standalone: true,
  imports: [CommonModule],
  providers: [SnackbarService],
  templateUrl: './watch-sample.component.html',
  styleUrl: './watch-sample.component.scss',
})
export class WatchSampleComponent {
  public readonly counter = signal(0);
  private readonly snackbarService = inject(SnackbarService);

  constructor() {
    watch(this.counter, (value) => {
      console.log('counter:', value);
    });
  }

  public increment(): void {
    this.counter.update((value) => value + 1);
  }

  public decrement(): void {
    this.counter.update((value) => value - 1);
  }
}
