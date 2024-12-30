import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleGenerationComponent } from './article-generation.component';

describe('ArticleGenerationComponent', () => {
  let component: ArticleGenerationComponent;
  let fixture: ComponentFixture<ArticleGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleGenerationComponent]
    });
    fixture = TestBed.createComponent(ArticleGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
