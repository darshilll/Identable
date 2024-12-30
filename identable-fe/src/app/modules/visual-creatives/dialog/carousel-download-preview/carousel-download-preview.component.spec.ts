import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselDownloadPreviewComponent } from './carousel-download-preview.component';

describe('CarouselDownloadPreviewComponent', () => {
  let component: CarouselDownloadPreviewComponent;
  let fixture: ComponentFixture<CarouselDownloadPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselDownloadPreviewComponent]
    });
    fixture = TestBed.createComponent(CarouselDownloadPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
