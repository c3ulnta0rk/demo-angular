
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';
import expansionAnimation from '../animation-example/animations/expansion.animation';

@Component({
    selector: 'c3-home-page',
    imports: [C3CardComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [expansionAnimation]
})
export class HomePageComponent {
  public homeExpanded = false;

  toggleExpanded(): void {
    this.homeExpanded = !this.homeExpanded;
  }
}
