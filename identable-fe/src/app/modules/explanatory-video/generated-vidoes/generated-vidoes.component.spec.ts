import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedVidoesComponent } from './generated-vidoes.component';

describe('GeneratedVidoesComponent', () => {
  let component: GeneratedVidoesComponent;
  let fixture: ComponentFixture<GeneratedVidoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratedVidoesComponent]
    });
    fixture = TestBed.createComponent(GeneratedVidoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
