import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFilterdialogComponent } from './custom-filterdialog.component';

describe('CustomFilterdialogComponent', () => {
  let component: CustomFilterdialogComponent;
  let fixture: ComponentFixture<CustomFilterdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomFilterdialogComponent]
    });
    fixture = TestBed.createComponent(CustomFilterdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
