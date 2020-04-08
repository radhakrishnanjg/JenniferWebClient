import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossborderuserlistComponent } from './crossborderuserlist.component';

describe('CrossborderuserlistComponent', () => {
  let component: CrossborderuserlistComponent;
  let fixture: ComponentFixture<CrossborderuserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossborderuserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossborderuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
