import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppkeyInfoPage } from './appkey-info.page';

describe('AppkeyInfoPage', () => {
  let component: AppkeyInfoPage;
  let fixture: ComponentFixture<AppkeyInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppkeyInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppkeyInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
