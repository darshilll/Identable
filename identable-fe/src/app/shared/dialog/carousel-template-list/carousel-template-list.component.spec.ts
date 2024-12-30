import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselTemplateListComponent } from './carousel-template-list.component';

describe('CarouselTemplateListComponent', () => {
  let component: CarouselTemplateListComponent;
  let fixture: ComponentFixture<CarouselTemplateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselTemplateListComponent]
    });
    fixture = TestBed.createComponent(CarouselTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
