import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomCarouselThemeComponent } from './add-custom-carousel-theme.component';

describe('AddCustomCarouselThemeComponent', () => {
  let component: AddCustomCarouselThemeComponent;
  let fixture: ComponentFixture<AddCustomCarouselThemeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomCarouselThemeComponent]
    });
    fixture = TestBed.createComponent(AddCustomCarouselThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
