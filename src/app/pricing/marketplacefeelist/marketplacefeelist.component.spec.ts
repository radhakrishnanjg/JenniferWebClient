import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplacefeelistComponent } from './marketplacefeelist.component';

describe('MarketplacefeelistComponent', () => {
  let component: MarketplacefeelistComponent;
  let fixture: ComponentFixture<MarketplacefeelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplacefeelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplacefeelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
