import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeCallpagePage } from './tree-callpage.page';

describe('TreeCallpagePage', () => {
  let component: TreeCallpagePage;
  let fixture: ComponentFixture<TreeCallpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeCallpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCallpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
