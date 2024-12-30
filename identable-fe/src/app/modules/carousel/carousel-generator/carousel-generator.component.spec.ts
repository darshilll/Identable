import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselGeneratorComponent } from './carousel-generator.component';

describe('CarouselGeneratorComponent', () => {
  let component: CarouselGeneratorComponent;
  let fixture: ComponentFixture<CarouselGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselGeneratorComponent]
    });
    fixture = TestBed.createComponent(CarouselGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
