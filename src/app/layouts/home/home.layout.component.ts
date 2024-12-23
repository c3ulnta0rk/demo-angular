import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'c3-home.layout',
    imports: [CommonModule, RouterModule, HeaderComponent, NavbarComponent],
    templateUrl: './home.layout.component.html',
    styleUrl: './home.layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLayoutComponent {}
