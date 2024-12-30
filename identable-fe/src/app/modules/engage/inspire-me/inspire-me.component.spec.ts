import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspireMeComponent } from './inspire-me.component';

describe('InspireMeComponent', () => {
  let component: InspireMeComponent;
  let fixture: ComponentFixture<InspireMeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspireMeComponent]
    });
    fixture = TestBed.createComponent(InspireMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
