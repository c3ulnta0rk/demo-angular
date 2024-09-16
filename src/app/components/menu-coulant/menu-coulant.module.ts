import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCoulantComponent } from './menu-coulant.component';
import { C3MenuCoulantMenu } from './menu-coulant-menu/menu-coulant-menu.component';
import { C3MenuCoulantContent } from './menu-coulant-content/menu-coulant-content.component';

@NgModule({
  declarations: [MenuCoulantComponent, C3MenuCoulantMenu, C3MenuCoulantContent],
  imports: [CommonModule],
  exports: [MenuCoulantComponent, C3MenuCoulantMenu, C3MenuCoulantContent],
})
export class C3MenuCoulantModule {}
