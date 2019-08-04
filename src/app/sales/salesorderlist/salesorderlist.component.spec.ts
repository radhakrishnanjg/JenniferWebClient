import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderlistComponent } from './salesorderlist.component';

describe('SalesorderlistComponent', () => {
  let component: SalesorderlistComponent;
  let fixture: ComponentFixture<SalesorderlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
