import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignControlComponent } from './design-control.component';

describe('DesignControlComponent', () => {
  let component: DesignControlComponent;
  let fixture: ComponentFixture<DesignControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignControlComponent]
    });
    fixture = TestBed.createComponent(DesignControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
