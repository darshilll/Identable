import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBrandKitAlertComponent } from './create-brand-kit-alert.component';

describe('CreateBrandKitAlertComponent', () => {
  let component: CreateBrandKitAlertComponent;
  let fixture: ComponentFixture<CreateBrandKitAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBrandKitAlertComponent]
    });
    fixture = TestBed.createComponent(CreateBrandKitAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
