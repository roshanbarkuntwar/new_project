import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlLightTranPage } from './sql-light-tran.page';

describe('SqlLightTranPage', () => {
  let component: SqlLightTranPage;
  let fixture: ComponentFixture<SqlLightTranPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlLightTranPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlLightTranPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
