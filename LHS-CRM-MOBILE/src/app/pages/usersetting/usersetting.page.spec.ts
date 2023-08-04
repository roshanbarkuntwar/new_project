import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersettingPage } from './usersetting.page';

describe('UsersettingPage', () => {
  let component: UsersettingPage;
  let fixture: ComponentFixture<UsersettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
