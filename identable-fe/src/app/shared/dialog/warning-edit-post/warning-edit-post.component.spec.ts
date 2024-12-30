import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningEditPostComponent } from './warning-edit-post.component';

describe('WarningEditPostComponent', () => {
  let component: WarningEditPostComponent;
  let fixture: ComponentFixture<WarningEditPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarningEditPostComponent]
    });
    fixture = TestBed.createComponent(WarningEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
