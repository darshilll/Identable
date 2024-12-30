import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAuthComponent } from './verify-auth.component';

describe('VerifyAuthComponent', () => {
  let component: VerifyAuthComponent;
  let fixture: ComponentFixture<VerifyAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyAuthComponent]
    });
    fixture = TestBed.createComponent(VerifyAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
