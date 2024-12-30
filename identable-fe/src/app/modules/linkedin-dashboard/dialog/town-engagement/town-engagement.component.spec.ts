import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownEngagementComponent } from './town-engagement.component';

describe('TownEngagementComponent', () => {
  let component: TownEngagementComponent;
  let fixture: ComponentFixture<TownEngagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TownEngagementComponent]
    });
    fixture = TestBed.createComponent(TownEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
