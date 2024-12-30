import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressivePopupComponent } from './progressive-popup.component';

describe('ProgressivePopupComponent', () => {
  let component: ProgressivePopupComponent;
  let fixture: ComponentFixture<ProgressivePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressivePopupComponent]
    });
    fixture = TestBed.createComponent(ProgressivePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
