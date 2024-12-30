import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLinkedinPostComponent } from './edit-linkedin-post.component';

describe('EditLinkedinPostComponent', () => {
  let component: EditLinkedinPostComponent;
  let fixture: ComponentFixture<EditLinkedinPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLinkedinPostComponent]
    });
    fixture = TestBed.createComponent(EditLinkedinPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
