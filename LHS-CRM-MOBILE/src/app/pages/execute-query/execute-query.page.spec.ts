import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteQueryPage } from './execute-query.page';

describe('ExecuteQueryPage', () => {
  let component: ExecuteQueryPage;
  let fixture: ComponentFixture<ExecuteQueryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecuteQueryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteQueryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
