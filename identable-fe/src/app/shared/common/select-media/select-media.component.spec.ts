import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMediaComponent } from './select-media.component';

describe('SelectMediaComponent', () => {
  let component: SelectMediaComponent;
  let fixture: ComponentFixture<SelectMediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMediaComponent]
    });
    fixture = TestBed.createComponent(SelectMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
