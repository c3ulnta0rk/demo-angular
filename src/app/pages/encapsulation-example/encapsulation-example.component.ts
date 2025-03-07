import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { C3InputComponent } from '../../components/component-input/component-input.component';

@Component({
    selector: 'c3-encapsulation-example',
    imports: [CommonModule, C3InputComponent],
    templateUrl: './encapsulation-example.component.html',
    styleUrl: './encapsulation-example.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'c3-encapsulation-example',
    }
})
export class EncapsulationExampleComponent {}
