import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUpgradeDialogComponent } from './plan-upgrade-dialog.component';

describe('PlanUpgradeDialogComponent', () => {
  let component: PlanUpgradeDialogComponent;
  let fixture: ComponentFixture<PlanUpgradeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanUpgradeDialogComponent]
    });
    fixture = TestBed.createComponent(PlanUpgradeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
