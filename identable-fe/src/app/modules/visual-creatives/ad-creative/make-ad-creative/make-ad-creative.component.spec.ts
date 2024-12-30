import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAdCreativeComponent } from './make-ad-creative.component';

describe('MakeAdCreativeComponent', () => {
  let component: MakeAdCreativeComponent;
  let fixture: ComponentFixture<MakeAdCreativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeAdCreativeComponent]
    });
    fixture = TestBed.createComponent(MakeAdCreativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
