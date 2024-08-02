import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C3OptionComponent } from './option.component';

describe('OptionComponent', () => {
  let component: C3OptionComponent;
  let fixture: ComponentFixture<C3OptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [C3OptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(C3OptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
