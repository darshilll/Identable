import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselMakerComponent } from './carousel-maker.component';

describe('CarouselMakerComponent', () => {
  let component: CarouselMakerComponent;
  let fixture: ComponentFixture<CarouselMakerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselMakerComponent]
    });
    fixture = TestBed.createComponent(CarouselMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
