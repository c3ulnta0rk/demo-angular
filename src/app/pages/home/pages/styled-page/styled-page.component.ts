import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'c3-styled-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './styled-page.component.html',
  styleUrl: './styled-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyledPageComponent { }
