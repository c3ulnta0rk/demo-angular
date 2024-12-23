import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';
import { C3MenuCoulantModule } from '../../components/menu-coulant/menu-coulant.module';

@Component({
    selector: 'menu-coulant',
    imports: [CommonModule, C3CardComponent, C3MenuCoulantModule],
    templateUrl: './menu-coulant.component.html',
    styleUrl: './menu-coulant.component.scss'
})
export class MenuCoulantPage {}
