import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CardComponent } from '../../components/card/card.component';
import { CarouselItemDirective } from '../../components/carousel/carousel-item.directive';
import { ScrollDispatcherService } from '../../modules/scrollDispatcher/scrollDispatcher.service';
import { DropdownService } from '../../components/dropdown/dropdown.service';
import { SampleComponent } from '../../components/sample/sample.component';
import { AttachScrollDirective } from '../../modules/scrollDispatcher/attachScroll.directive';
import { filter } from 'rxjs';
import { C3OnScrollEndDirective } from '../../directives/onScrollEnd.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'c3-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
