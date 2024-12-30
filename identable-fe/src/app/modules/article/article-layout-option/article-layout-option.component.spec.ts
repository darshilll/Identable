import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleLayoutOptionComponent } from './article-layout-option.component';

describe('ArticleLayoutOptionComponent', () => {
  let component: ArticleLayoutOptionComponent;
  let fixture: ComponentFixture<ArticleLayoutOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleLayoutOptionComponent]
    });
    fixture = TestBed.createComponent(ArticleLayoutOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
