import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevFrameMastEditorPage } from './dev-frame-mast-editor.page';

describe('DevFrameMastEditorPage', () => {
  let component: DevFrameMastEditorPage;
  let fixture: ComponentFixture<DevFrameMastEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevFrameMastEditorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevFrameMastEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
