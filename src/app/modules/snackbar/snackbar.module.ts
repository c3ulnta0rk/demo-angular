import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './snackbar.component';
import { SnackbarService } from './snackbar.service';
import { C3InjectorService } from '../injector/injector.service';

@NgModule({
  imports: [CommonModule, SnackbarComponent],
  providers: [SnackbarService, C3InjectorService],
})
export class SnackbarModule {}
