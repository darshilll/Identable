import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPreviewDialogComponent } from './post-preview-dialog.component';

describe('PostPreviewDialogComponent', () => {
  let component: PostPreviewDialogComponent;
  let fixture: ComponentFixture<PostPreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostPreviewDialogComponent]
    });
    fixture = TestBed.createComponent(PostPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
