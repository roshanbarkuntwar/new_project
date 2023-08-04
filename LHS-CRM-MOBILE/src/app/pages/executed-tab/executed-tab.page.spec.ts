import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutedTabPage } from './executed-tab.page';

describe('ExecutedTabPage', () => {
  let component: ExecutedTabPage;
  let fixture: ComponentFixture<ExecutedTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutedTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutedTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
