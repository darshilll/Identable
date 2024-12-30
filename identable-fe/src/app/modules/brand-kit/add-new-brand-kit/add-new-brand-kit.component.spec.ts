import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBrandKitComponent } from './add-new-brand-kit.component';

describe('AddNewBrandKitComponent', () => {
  let component: AddNewBrandKitComponent;
  let fixture: ComponentFixture<AddNewBrandKitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBrandKitComponent]
    });
    fixture = TestBed.createComponent(AddNewBrandKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
