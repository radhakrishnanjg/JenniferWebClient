import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptslistComponent } from './receiptslist.component';

describe('ReceiptslistComponent', () => {
  let component: ReceiptslistComponent;
  let fixture: ComponentFixture<ReceiptslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
