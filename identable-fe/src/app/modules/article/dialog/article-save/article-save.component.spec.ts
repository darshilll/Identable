import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSaveComponent } from './article-save.component';

describe('ArticleSaveComponent', () => {
  let component: ArticleSaveComponent;
  let fixture: ComponentFixture<ArticleSaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleSaveComponent]
    });
    fixture = TestBed.createComponent(ArticleSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
