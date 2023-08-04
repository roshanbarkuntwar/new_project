import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeServerSettingPage } from './change-server-setting.page';

describe('ChangeServerSettingPage', () => {
  let component: ChangeServerSettingPage;
  let fixture: ComponentFixture<ChangeServerSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeServerSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeServerSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
