import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderviewComponent } from './salesorderview.component';

describe('SalesorderviewComponent', () => {
  let component: SalesorderviewComponent;
  let fixture: ComponentFixture<SalesorderviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
