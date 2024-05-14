import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'c3-component-input',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './component-input.component.html',
  styleUrl: './component-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentInputComponent { }
