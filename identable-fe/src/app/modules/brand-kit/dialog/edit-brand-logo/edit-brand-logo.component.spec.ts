import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBrandLogoComponent } from './edit-brand-logo.component';

describe('EditBrandLogoComponent', () => {
  let component: EditBrandLogoComponent;
  let fixture: ComponentFixture<EditBrandLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBrandLogoComponent]
    });
    fixture = TestBed.createComponent(EditBrandLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
