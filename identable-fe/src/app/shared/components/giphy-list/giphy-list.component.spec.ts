import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiphyListComponent } from './giphy-list.component';

describe('GiphyListComponent', () => {
  let component: GiphyListComponent;
  let fixture: ComponentFixture<GiphyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiphyListComponent]
    });
    fixture = TestBed.createComponent(GiphyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
