import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C3AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: C3AutocompleteComponent;
  let fixture: ComponentFixture<C3AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [C3AutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(C3AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
