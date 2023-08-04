import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectLovPage } from './single-select-lov.page';

describe('SingleSelectLovPage', () => {
  let component: SingleSelectLovPage;
  let fixture: ComponentFixture<SingleSelectLovPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSelectLovPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectLovPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
