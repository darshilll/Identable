import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceCarouselTemplatesComponent } from './choice-carousel-templates.component';

describe('ChoiceCarouselTemplatesComponent', () => {
  let component: ChoiceCarouselTemplatesComponent;
  let fixture: ComponentFixture<ChoiceCarouselTemplatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChoiceCarouselTemplatesComponent]
    });
    fixture = TestBed.createComponent(ChoiceCarouselTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
