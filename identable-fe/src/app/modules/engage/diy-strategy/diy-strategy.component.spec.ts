import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyStrategyComponent } from './diy-strategy.component';

describe('DiyStrategyComponent', () => {
  let component: DiyStrategyComponent;
  let fixture: ComponentFixture<DiyStrategyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiyStrategyComponent]
    });
    fixture = TestBed.createComponent(DiyStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
