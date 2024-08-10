import {
  ApplicationRef,
  ComponentRef,
  inject,
  Injectable,
  TemplateRef,
} from '@angular/core';

//https://stackoverflow.com/questions/39857222/angular2-dynamic-component-injection-in-root

export interface SnackbarConfig {
  duration?: number;
  class?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly applicationRef = inject(ApplicationRef);

  constructor() {
    console.log('SnackbarService:', this.applicationRef);
  }

  public open(
    message: string | ComponentRef<any> | TemplateRef<any>,
    config?: SnackbarConfig
  ): void {
    console.log('Snackbar:', message);
  }
}
