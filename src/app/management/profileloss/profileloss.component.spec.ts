import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilelossComponent } from './profileloss.component';

describe('ProfilelossComponent', () => {
  let component: ProfilelossComponent;
  let fixture: ComponentFixture<ProfilelossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilelossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilelossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
