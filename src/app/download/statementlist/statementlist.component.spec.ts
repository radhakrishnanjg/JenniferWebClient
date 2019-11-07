import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementlistComponent } from './statementlist.component';

describe('StatementlistComponent', () => {
  let component: StatementlistComponent;
  let fixture: ComponentFixture<StatementlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
