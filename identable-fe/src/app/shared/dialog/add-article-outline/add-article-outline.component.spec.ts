import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleOutlineComponent } from './add-article-outline.component';

describe('AddArticleOutlineComponent', () => {
  let component: AddArticleOutlineComponent;
  let fixture: ComponentFixture<AddArticleOutlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddArticleOutlineComponent]
    });
    fixture = TestBed.createComponent(AddArticleOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
