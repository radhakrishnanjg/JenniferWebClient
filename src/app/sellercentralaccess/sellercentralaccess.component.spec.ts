import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellercentralaccessComponent } from './sellercentralaccess.component';

describe('SellercentralaccessComponent', () => {
  let component: SellercentralaccessComponent;
  let fixture: ComponentFixture<SellercentralaccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellercentralaccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellercentralaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
