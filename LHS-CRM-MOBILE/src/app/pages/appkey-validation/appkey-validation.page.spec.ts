import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppkeyValidationPage } from './appkey-validation.page';

describe('AppkeyValidationPage', () => {
  let component: AppkeyValidationPage;
  let fixture: ComponentFixture<AppkeyValidationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppkeyValidationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppkeyValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
