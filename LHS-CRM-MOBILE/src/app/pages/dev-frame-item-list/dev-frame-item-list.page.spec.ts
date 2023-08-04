import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevFrameItemListPage } from './dev-frame-item-list.page';

describe('DevFrameItemListPage', () => {
  let component: DevFrameItemListPage;
  let fixture: ComponentFixture<DevFrameItemListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevFrameItemListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevFrameItemListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
