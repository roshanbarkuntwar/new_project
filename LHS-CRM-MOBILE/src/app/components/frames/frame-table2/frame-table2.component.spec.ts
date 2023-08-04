import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameTable2Component } from './frame-table2.component';

describe('FrameTable2Component', () => {
  let component: FrameTable2Component;
  let fixture: ComponentFixture<FrameTable2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameTable2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameTable2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
