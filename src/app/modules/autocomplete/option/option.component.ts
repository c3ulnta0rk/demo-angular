import { Component, effect, ElementRef, inject, signal } from '@angular/core';

@Component({
  selector: 'c3-option',
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
})
export class C3OptionComponent {
  public readonly selected = signal(false);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    effect(
      () => {
        if (this.selected()) {
          if (this.elementRef.nativeElement.scrollIntoView)
            this.elementRef.nativeElement.scrollIntoView({
              block: 'nearest',
              inline: 'nearest',
            });
          this.elementRef.nativeElement.classList.add('selected');
        } else {
          this.elementRef.nativeElement.classList.remove('selected');
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  public select() {
    this.selected.set(true);
  }

  public deselect() {
    this.selected.set(false);
  }
}
