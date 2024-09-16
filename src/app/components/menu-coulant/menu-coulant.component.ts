import {
  Component,
  contentChildren,
  effect,
  signal,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { C3MenuCoulantMenu } from './menu-coulant-menu/menu-coulant-menu.component';

@Component({
  selector: 'c3-menu-coulant',
  templateUrl: './menu-coulant.component.html',
  styleUrl: './menu-coulant.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c3-menu-coulant',
    ngSkipHydration: 'true',
  },
})
export class MenuCoulantComponent {
  public readonly c3MenuCoulant = contentChildren(C3MenuCoulantMenu);
  private readonly targetContentRef = viewChild('targetContent', {
    read: ViewContainerRef,
  });

  public readonly selectedIndex = signal(0);

  constructor() {
    effect(() => {
      if (this.targetContentRef()) {
        this.updateView();
      }
    });
  }

  public selectMenu(index: number) {
    this.selectedIndex.set(index);
    this.updateView();
  }

  private updateView() {
    this.targetContentRef().clear();
    const selectedMenu = this.c3MenuCoulant()[this.selectedIndex()];
    if (selectedMenu) {
      this.targetContentRef().createEmbeddedView(selectedMenu.contentTpl());
    }
  }
}
