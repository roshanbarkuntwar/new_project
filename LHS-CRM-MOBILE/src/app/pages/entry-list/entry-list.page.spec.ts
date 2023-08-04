import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryListPage } from './entry-list.page';

describe('EntryListPage', () => {
  let component: EntryListPage;
  let fixture: ComponentFixture<EntryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
