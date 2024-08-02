import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { C3AutocompleteComponent } from '../container/autocomplete.component';

@Directive({
  selector: 'input[c3Autocomplete], textarea[c3Autocomplete]',
  host: {
    '(focus)': 'c3Autocomplete().open()',
    '(blur)': 'c3Autocomplete().close()',
    '(keydown)': 'c3Autocomplete().keydown($event)',
  },
})
export class C3AutocompleteDirective implements AfterViewInit {
  public readonly c3Autocomplete = input<C3AutocompleteComponent>();
  private readonly c3InputRef: ElementRef<
    HTMLInputElement | HTMLTextAreaElement
  > = inject(ElementRef);

  public ngAfterViewInit() {
    this.c3Autocomplete().inputRef.set(this.c3InputRef.nativeElement);
  }
}
