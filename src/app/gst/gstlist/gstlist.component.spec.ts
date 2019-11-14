import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstlistComponent } from './gstlist.component';

describe('GstlistComponent', () => {
  let component: GstlistComponent;
  let fixture: ComponentFixture<GstlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
