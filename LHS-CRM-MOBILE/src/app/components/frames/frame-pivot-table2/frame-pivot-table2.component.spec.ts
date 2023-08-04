import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramePivotTable2Component } from './frame-pivot-table2.component';

describe('FramePivotTable2Component', () => {
  let component: FramePivotTable2Component;
  let fixture: ComponentFixture<FramePivotTable2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramePivotTable2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramePivotTable2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
