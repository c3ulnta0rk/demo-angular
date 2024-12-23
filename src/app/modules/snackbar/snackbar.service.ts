import {
  ComponentRef,
  inject,
  Injectable,
  TemplateRef,
  Type,
} from '@angular/core';
import { C3InjectorService } from '../overlays/services/injector';
import { SnackbarComponent } from './snackbar.component';
import { c3ApplyInputValues } from '../../utils/fill-inputs';

export interface SnackbarConfig {
  duration?: number;
  class?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly injectorService = inject(C3InjectorService);

  public open(
    message: string | ComponentRef<any> | TemplateRef<any>,
    config?: SnackbarConfig
  ): void {
    const snackbarRef = this.injectorService.injectComponent(SnackbarComponent);
    if (!snackbarRef) return;

    if (typeof message === 'string') {
      c3ApplyInputValues(SnackbarComponent, { message }, snackbarRef);
    } else if (message instanceof TemplateRef) {
      c3ApplyInputValues(
        SnackbarComponent,
        { templateRef: message },
        snackbarRef
      );
    } else {
      const componentRef = this.injectorService.injectComponent(
        message.componentType
      );
      c3ApplyInputValues(SnackbarComponent, { componentRef }, snackbarRef);
    }

    const duration = config?.duration || 3000;

    setTimeout(() => {
      this.close(snackbarRef);
    }, duration);
  }

  public close(snackbarRef: ComponentRef<SnackbarComponent>): void {
    this.injectorService.removeComponent(snackbarRef);
  }
}
