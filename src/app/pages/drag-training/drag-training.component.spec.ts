import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragTrainingComponent } from './drag-training.component';

describe('DragTrainingComponent', () => {
  let component: DragTrainingComponent;
  let fixture: ComponentFixture<DragTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
