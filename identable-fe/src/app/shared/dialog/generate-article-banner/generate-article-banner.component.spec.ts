import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateArticleBannerComponent } from './generate-article-banner.component';

describe('GenerateArticleBannerComponent', () => {
  let component: GenerateArticleBannerComponent;
  let fixture: ComponentFixture<GenerateArticleBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateArticleBannerComponent]
    });
    fixture = TestBed.createComponent(GenerateArticleBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
