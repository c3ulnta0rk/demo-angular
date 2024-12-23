import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { C3TextRotatorComponent } from '../../components/text-rotator/text-rotator.component';
import { C3CardComponent } from '../../components/card/card.component';

@Component({
    selector: 'c3-example-rotation',
    imports: [CommonModule, C3TextRotatorComponent, C3CardComponent],
    templateUrl: './example-rotation.component.html',
    styleUrl: './example-rotation.component.scss'
})
export class ExampleRotationComponent {}
