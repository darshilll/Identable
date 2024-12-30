import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeOptionsComponent } from './creative-options.component';

describe('CreativeOptionsComponent', () => {
  let component: CreativeOptionsComponent;
  let fixture: ComponentFixture<CreativeOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeOptionsComponent]
    });
    fixture = TestBed.createComponent(CreativeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
