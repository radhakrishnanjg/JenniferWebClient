import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnotelistComponent } from './debitnotelist.component';

describe('DebitnotelistComponent', () => {
  let component: DebitnotelistComponent;
  let fixture: ComponentFixture<DebitnotelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitnotelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitnotelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
