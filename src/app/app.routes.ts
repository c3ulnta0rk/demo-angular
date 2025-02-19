import { Routes } from '@angular/router';
import { EncapsulationExampleComponent } from './pages/encapsulation-example/encapsulation-example.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { DefaultLayoutComponent } from './layouts/default/default.layout.component';
import { AutoScrollComponent } from './pages/auto-scroll/auto-scroll.component';
import { WatchSampleComponent } from './pages/watch-sample/watch-sample.component';
import { TemplateRefComponent } from './pages/template-ref/template-ref.component';
import { AnimationExampleComponent } from './pages/animation-example/animation-example.component';
import { ExampleRotationComponent } from './pages/example-rotation/example-rotation.component';
import { DragDropExampleComponent } from './pages/drag-drop-example/drag-drop-example.component';
import { MenuCoulantPage } from './pages/menu-coulant/menu-coulant.component';
import { ButtonUnderlineComponent } from './pages/button-underline/button-underline.component';
import { TooltipComponent } from './pages/tooltip/tooltip.component';
import { OverlayExampleComponent } from './pages/overlay-example/overlay-example.component';
import { DropdownExamplePageComponent } from './pages/dropdown-example/dropdown-example.component';
import { CarouselExampleComponent } from './pages/carousel-example/carousel-example.component';
import { SortableExampleComponent } from './pages/sortable-example/sortable-example.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
        data: {
          title: 'Home',
        },
      },
      {
        path: 'dd-example',
        component: DropdownExamplePageComponent,
        data: {
          title: 'Dropdown',
        },
      },
      {
        path: 'overlay-example',
        component: OverlayExampleComponent,
        data: {
          title: 'Overlay',
        },
      },
      {
        path: 'encapsulation-example',
        component: EncapsulationExampleComponent,
        data: {
          title: 'Encapsulation',
        },
      },
      {
        path: 'auto-scroll',
        component: AutoScrollComponent,
        data: {
          title: 'Autocomplete / AutoScroll',
        },
      },
      {
        path: 'watch-sample',
        component: WatchSampleComponent,
        data: {
          title: 'C3 Watch',
        },
      },
      {
        path: 'template-ref-sample',
        component: TemplateRefComponent,
        data: {
          title: 'Template Ref',
        },
      },
      {
        path: 'animation-example',
        component: AnimationExampleComponent,
        data: {
          title: 'Animation (work in progress)',
        },
      },
      {
        path: 'rotation-example',
        component: ExampleRotationComponent,
        data: {
          title: 'Rotation Text',
        },
      },
      {
        path: 'drag-and-drop',
        component: DragDropExampleComponent,
        data: {
          title: 'Drag Drop w Inertia',
        },
      },
      {
        path: 'menu-coulant',
        component: MenuCoulantPage,
        data: {
          title: 'Menu Coulant',
        },
      },
      {
        path: 'button-underline',
        component: ButtonUnderlineComponent,
        data: {
          title: 'Bouton underline',
        },
      },
      {
        path: 'tooltip',
        component: TooltipComponent,
        data: {
          title: 'Tooltip sample',
        },
      },
      {
        path: 'carousel-example',
        component: CarouselExampleComponent,
        data: {
          title: 'Carousel Example',
        },
      },
      {
        path: 'sortable-example',
        component: SortableExampleComponent,
        data: {
          title: 'Liste triable',
        },
      },
      { path: '**', redirectTo: '/home' },
    ],
  },
];
