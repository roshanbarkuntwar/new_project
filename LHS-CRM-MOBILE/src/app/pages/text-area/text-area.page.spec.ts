import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaPage } from './text-area.page';

describe('TextAreaPage', () => {
  let component: TextAreaPage;
  let fixture: ComponentFixture<TextAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAreaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
