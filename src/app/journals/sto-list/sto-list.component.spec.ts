import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoListComponent } from './sto-list.component';

describe('StoListComponent', () => {
  let component: StoListComponent;
  let fixture: ComponentFixture<StoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
