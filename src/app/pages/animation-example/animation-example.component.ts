
import { Component, signal } from '@angular/core';
import translateXAnimation from './animations/translateX.animation';
import { C3CardComponent } from '../../components/card/card.component';

@Component({
    selector: 'c3-animation-example',
    imports: [C3CardComponent],
    templateUrl: './animation-example.component.html',
    styleUrl: './animation-example.component.scss',
    animations: [translateXAnimation]
})
export class AnimationExampleComponent {
  public readonly translateXState = signal('initial');

  public toggleTranslateX() {
    this.translateXState.set(
      this.translateXState() === 'initial' ? 'changed' : 'initial'
    );
  }
}
