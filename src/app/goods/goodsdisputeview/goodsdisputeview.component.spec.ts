import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsdisputeviewComponent } from './goodsdisputeview.component';

describe('GoodsdisputeviewComponent', () => {
  let component: GoodsdisputeviewComponent;
  let fixture: ComponentFixture<GoodsdisputeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsdisputeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsdisputeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
