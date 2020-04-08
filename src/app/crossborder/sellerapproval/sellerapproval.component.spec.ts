import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerapprovalComponent } from './sellerapproval.component';

describe('SellerapprovalComponent', () => {
  let component: SellerapprovalComponent;
  let fixture: ComponentFixture<SellerapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
