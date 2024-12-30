import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeadingComponent } from './add-heading.component';

describe('AddHeadingComponent', () => {
  let component: AddHeadingComponent;
  let fixture: ComponentFixture<AddHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHeadingComponent]
    });
    fixture = TestBed.createComponent(AddHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
