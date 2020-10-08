import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxledgerComponent } from './taxledger.component';

describe('TaxledgerComponent', () => {
  let component: TaxledgerComponent;
  let fixture: ComponentFixture<TaxledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
