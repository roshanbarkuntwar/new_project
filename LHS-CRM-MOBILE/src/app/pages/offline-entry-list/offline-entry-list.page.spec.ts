import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineEntryListPage } from './offline-entry-list.page';

describe('OfflineEntryListPage', () => {
  let component: OfflineEntryListPage;
  let fixture: ComponentFixture<OfflineEntryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineEntryListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineEntryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
