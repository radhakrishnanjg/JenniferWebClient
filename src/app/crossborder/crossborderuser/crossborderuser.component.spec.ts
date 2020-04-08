import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossborderuserComponent } from './crossborderuser.component';

describe('CrossborderuserComponent', () => {
  let component: CrossborderuserComponent;
  let fixture: ComponentFixture<CrossborderuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossborderuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossborderuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
