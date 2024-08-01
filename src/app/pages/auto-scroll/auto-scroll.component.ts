import { CommonModule } from '@angular/common';
import { Component, computed, signal, viewChild } from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';
import { AutoScrollDirective } from '../../directives/autoScroll.directive';

@Component({
  selector: 'c3-auto-scroll',
  standalone: true,
  imports: [CommonModule, C3CardComponent, AutoScrollDirective],
  templateUrl: './auto-scroll.component.html',
  styleUrl: './auto-scroll.component.scss',
})
export class AutoScrollComponent {
  public readonly items = signal(Array.from({ length: 100 }, (_, i) => i));
  public readonly scrollContainer = viewChild(AutoScrollDirective);

  public readonly selected = computed(() =>
    this.scrollContainer().selectedIndex()
  );
}
