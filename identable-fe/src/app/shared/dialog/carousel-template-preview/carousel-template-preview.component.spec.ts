import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselTemplatePreviewComponent } from './carousel-template-preview.component';

describe('CarouselTemplatePreviewComponent', () => {
  let component: CarouselTemplatePreviewComponent;
  let fixture: ComponentFixture<CarouselTemplatePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselTemplatePreviewComponent]
    });
    fixture = TestBed.createComponent(CarouselTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
