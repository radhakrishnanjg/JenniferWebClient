import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoComponent } from './sto.component';

describe('StoComponent', () => {
  let component: StoComponent;
  let fixture: ComponentFixture<StoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
