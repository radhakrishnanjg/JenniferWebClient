import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderunsellableComponent } from './salesorderunsellable.component';

describe('SalesorderunsellableComponent', () => {
  let component: SalesorderunsellableComponent;
  let fixture: ComponentFixture<SalesorderunsellableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderunsellableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderunsellableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
