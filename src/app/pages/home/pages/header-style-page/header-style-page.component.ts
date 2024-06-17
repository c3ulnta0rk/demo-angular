import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C3CardComponent } from '../../../../components/card/card.component';

@Component({
  selector: 'c3-header-style-page',
  standalone: true,
  imports: [CommonModule, C3CardComponent],
  templateUrl: './header-style-page.component.html',
  styleUrl: './header-style-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderStylePageComponent {}
