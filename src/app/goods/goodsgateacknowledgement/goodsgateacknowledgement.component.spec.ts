import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsgateacknowledgementComponent } from './goodsgateacknowledgement.component';

describe('GoodsgateacknowledgementComponent', () => {
  let component: GoodsgateacknowledgementComponent;
  let fixture: ComponentFixture<GoodsgateacknowledgementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsgateacknowledgementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsgateacknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
