import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'c3-home-page',
  standalone: true,
  imports: [CommonModule, C3CardComponent, HeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  public homeExpanded = false;

  toggleExpanded(): void {
    this.homeExpanded = !this.homeExpanded;
  }
}
