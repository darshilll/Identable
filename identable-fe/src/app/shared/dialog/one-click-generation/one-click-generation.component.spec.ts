import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneClickGenerationComponent } from './one-click-generation.component';

describe('OneClickGenerationComponent', () => {
  let component: OneClickGenerationComponent;
  let fixture: ComponentFixture<OneClickGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneClickGenerationComponent]
    });
    fixture = TestBed.createComponent(OneClickGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
