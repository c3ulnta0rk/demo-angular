import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

@Component({
  selector: 'c3-option',
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C3OptionComponent {
  public readonly optionId = input<string | undefined>(undefined);
  public readonly selected = signal(false);
  private readonly elementRef = inject(ElementRef);
  private static counter = 0;

  constructor() {
    effect(() => {
      const element = this.elementRef.nativeElement;
      if (this.selected()) {
        if (element.scrollIntoView) {
          element.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
          });
        }
        element.classList.add('selected');
        element.setAttribute('aria-selected', 'true');
        element.setAttribute('tabindex', '0');
      } else {
        element.classList.remove('selected');
        element.setAttribute('aria-selected', 'false');
        element.setAttribute('tabindex', '-1');
      }
    });

    // Initialize accessibility attributes
    const element = this.elementRef.nativeElement;
    const id = this.optionId() || `c3-option-${C3OptionComponent.counter++}`;
    element.setAttribute('id', id);
    element.setAttribute('role', 'option');
    element.setAttribute('aria-selected', 'false');
    element.setAttribute('tabindex', '-1');
  }

  public select() {
    this.selected.set(true);
  }

  public deselect() {
    this.selected.set(false);
  }
}
