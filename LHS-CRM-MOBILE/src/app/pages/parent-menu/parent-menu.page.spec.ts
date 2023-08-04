import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMenuPage } from './parent-menu.page';

describe('ParentMenuPage', () => {
  let component: ParentMenuPage;
  let fixture: ComponentFixture<ParentMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentMenuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
