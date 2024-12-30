import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCtaSettingComponent } from './article-cta-setting.component';

describe('ArticleCtaSettingComponent', () => {
  let component: ArticleCtaSettingComponent;
  let fixture: ComponentFixture<ArticleCtaSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleCtaSettingComponent]
    });
    fixture = TestBed.createComponent(ArticleCtaSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
