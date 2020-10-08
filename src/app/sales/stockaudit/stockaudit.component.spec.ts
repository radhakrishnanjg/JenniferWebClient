import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockauditComponent } from './stockaudit.component';

describe('StockauditComponent', () => {
  let component: StockauditComponent;
  let fixture: ComponentFixture<StockauditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockauditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
