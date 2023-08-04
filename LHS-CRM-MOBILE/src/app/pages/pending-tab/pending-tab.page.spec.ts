import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTabPage } from './pending-tab.page';

describe('PendingTabPage', () => {
  let component: PendingTabPage;
  let fixture: ComponentFixture<PendingTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
