import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevClickEventsPage } from './dev-click-events.page';

describe('DevClickEventsPage', () => {
  let component: DevClickEventsPage;
  let fixture: ComponentFixture<DevClickEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevClickEventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevClickEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
