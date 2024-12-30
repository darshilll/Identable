import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePostDetailsComponent } from './single-post-details.component';

describe('SinglePostDetailsComponent', () => {
  let component: SinglePostDetailsComponent;
  let fixture: ComponentFixture<SinglePostDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinglePostDetailsComponent]
    });
    fixture = TestBed.createComponent(SinglePostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
