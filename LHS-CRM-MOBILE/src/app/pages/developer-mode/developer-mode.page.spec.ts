import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperModePage } from './developer-mode.page';

describe('DeveloperModePage', () => {
  let component: DeveloperModePage;
  let fixture: ComponentFixture<DeveloperModePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperModePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperModePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
