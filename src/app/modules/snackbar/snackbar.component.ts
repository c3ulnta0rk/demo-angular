import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { watch } from '../../utils/watch';

@Component({
  selector: 'c3-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  public readonly message = input('Hello, Snackbar!');
  public readonly templateRef = input<TemplateRef<any>>(undefined);
  public readonly componentRef = input<ComponentRef<any>>(undefined);

  private readonly viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    if (this.templateRef()) {
      this.viewContainerRef.createEmbeddedView(this.templateRef());
    } else if (this.componentRef()) {
      this.viewContainerRef.insert(this.componentRef().hostView);
    }
  }
}
