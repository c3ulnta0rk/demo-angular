import { Component, signal, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'c3-menu-coulant-menu',
  templateUrl: './menu-coulant-menu.component.html',
  styleUrl: './menu-coulant-menu.component.scss',
})
export class C3MenuCoulantMenu {
  public readonly menuTpl = viewChild('menuTpl', {
    read: TemplateRef,
  });
  public readonly contentTpl = viewChild('contentTpl', {
    read: TemplateRef,
  });

  public readonly active = signal(false);
}
