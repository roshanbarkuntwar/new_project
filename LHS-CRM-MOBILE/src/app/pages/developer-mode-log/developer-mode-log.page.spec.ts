import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperModeLogPage } from './developer-mode-log.page';

describe('DeveloperModeLogPage', () => {
  let component: DeveloperModeLogPage;
  let fixture: ComponentFixture<DeveloperModeLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperModeLogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperModeLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
