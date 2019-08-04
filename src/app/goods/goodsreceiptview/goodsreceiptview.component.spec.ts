import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsreceiptviewComponent } from './goodsreceiptview.component';

describe('GoodsreceiptviewComponent', () => {
  let component: GoodsreceiptviewComponent;
  let fixture: ComponentFixture<GoodsreceiptviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsreceiptviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsreceiptviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
