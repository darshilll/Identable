import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchProfileComponent } from './switch-profile.component';

describe('SwitchProfileComponent', () => {
  let component: SwitchProfileComponent;
  let fixture: ComponentFixture<SwitchProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchProfileComponent]
    });
    fixture = TestBed.createComponent(SwitchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
