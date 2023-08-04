import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAlertNotificationPage } from './multi-alert-notification.page';

describe('MultiAlertNotificationPage', () => {
  let component: MultiAlertNotificationPage;
  let fixture: ComponentFixture<MultiAlertNotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAlertNotificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAlertNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
