import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditerComponent } from './article-editer.component';

describe('ArticleEditerComponent', () => {
  let component: ArticleEditerComponent;
  let fixture: ComponentFixture<ArticleEditerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleEditerComponent]
    });
    fixture = TestBed.createComponent(ArticleEditerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
