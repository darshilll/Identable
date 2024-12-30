import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostContentPreviewComponent } from './post-content-preview.component';

describe('PostContentPreviewComponent', () => {
  let component: PostContentPreviewComponent;
  let fixture: ComponentFixture<PostContentPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostContentPreviewComponent]
    });
    fixture = TestBed.createComponent(PostContentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
