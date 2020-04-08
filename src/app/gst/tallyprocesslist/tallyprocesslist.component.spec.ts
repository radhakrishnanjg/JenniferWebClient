import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallyprocesslistComponent } from './tallyprocesslist.component';

describe('TallyprocesslistComponent', () => {
  let component: TallyprocesslistComponent;
  let fixture: ComponentFixture<TallyprocesslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallyprocesslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallyprocesslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
