import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedAivideoListComponent } from './generated-aivideo-list.component';

describe('GeneratedAivideoListComponent', () => {
  let component: GeneratedAivideoListComponent;
  let fixture: ComponentFixture<GeneratedAivideoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratedAivideoListComponent]
    });
    fixture = TestBed.createComponent(GeneratedAivideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
