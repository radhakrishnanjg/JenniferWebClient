import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporthistoryComponent } from './supporthistory.component';

describe('SupporthistoryComponent', () => {
  let component: SupporthistoryComponent;
  let fixture: ComponentFixture<SupporthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupporthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
