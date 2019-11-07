import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementviewComponent } from './statementview.component';

describe('StatementviewComponent', () => {
  let component: StatementviewComponent;
  let fixture: ComponentFixture<StatementviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
