import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLevelTabPage } from './multi-level-tab.page';

describe('MultiLevelTabPage', () => {
  let component: MultiLevelTabPage;
  let fixture: ComponentFixture<MultiLevelTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLevelTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLevelTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
