import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './snackbar.component';
import { SnackbarService } from './snackbar.service';
import { InjectorService } from '../../services/injector';

@NgModule({
  imports: [CommonModule, SnackbarComponent],
  providers: [SnackbarService, InjectorService],
})
export class SnackbarModule {}
