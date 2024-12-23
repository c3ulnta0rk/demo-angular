import { CommonModule } from '@angular/common';
import {
  Component,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';

@Component({
    selector: 'c3-template-ref',
    imports: [CommonModule, C3CardComponent],
    templateUrl: './template-ref.component.html',
    styleUrl: './template-ref.component.scss'
})
export class TemplateRefComponent {
  private readonly ref = viewChild('ref', {
    read: TemplateRef,
  });

  public readonly target = viewChild('targetContainer', {
    read: ViewContainerRef,
  });

  public toggle() {
    if (this.target().length) this.target().clear();
    else this.target().createEmbeddedView(this.ref());
  }
}
