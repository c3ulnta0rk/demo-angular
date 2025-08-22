
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'c3-component-input',
    imports: [FormsModule],
    templateUrl: './component-input.component.html',
    styleUrl: './component-input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3InputComponent {
  value = model<string>('');

  private valueEffect = effect(() => {
    console.log('Value changed:', this.value());
  });
}
