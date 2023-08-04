import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevObjFrameListPage } from './dev-obj-frame-list.page';

describe('DevObjFrameListPage', () => {
  let component: DevObjFrameListPage;
  let fixture: ComponentFixture<DevObjFrameListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevObjFrameListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevObjFrameListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
