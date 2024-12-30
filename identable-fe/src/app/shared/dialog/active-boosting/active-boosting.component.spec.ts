import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveBoostingComponent } from './active-boosting.component';

describe('ActiveBoostingComponent', () => {
  let component: ActiveBoostingComponent;
  let fixture: ComponentFixture<ActiveBoostingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveBoostingComponent]
    });
    fixture = TestBed.createComponent(ActiveBoostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
