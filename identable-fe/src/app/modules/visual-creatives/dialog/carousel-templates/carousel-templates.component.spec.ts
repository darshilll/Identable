import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselTemplatesComponent } from './carousel-templates.component';

describe('CarouselTemplatesComponent', () => {
  let component: CarouselTemplatesComponent;
  let fixture: ComponentFixture<CarouselTemplatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselTemplatesComponent]
    });
    fixture = TestBed.createComponent(CarouselTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
