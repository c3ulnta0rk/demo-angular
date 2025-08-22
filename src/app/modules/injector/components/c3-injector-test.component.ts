import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
selector: 'c3-test-component',
    template: `<p>Test component content</p>`,
    standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3TestComponent {}
