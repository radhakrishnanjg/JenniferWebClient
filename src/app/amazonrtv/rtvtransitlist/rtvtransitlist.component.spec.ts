import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtvtransitlistComponent } from './rtvtransitlist.component';

describe('RtvtransitlistComponent', () => {
  let component: RtvtransitlistComponent;
  let fixture: ComponentFixture<RtvtransitlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtvtransitlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtvtransitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
