import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoblistComponent } from './ppoblist.component';

describe('PpoblistComponent', () => {
  let component: PpoblistComponent;
  let fixture: ComponentFixture<PpoblistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoblistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
