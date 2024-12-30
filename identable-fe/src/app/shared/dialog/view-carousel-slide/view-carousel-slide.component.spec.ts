import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarouselSlideComponent } from './view-carousel-slide.component';

describe('ViewCarouselSlideComponent', () => {
  let component: ViewCarouselSlideComponent;
  let fixture: ComponentFixture<ViewCarouselSlideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCarouselSlideComponent]
    });
    fixture = TestBed.createComponent(ViewCarouselSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
