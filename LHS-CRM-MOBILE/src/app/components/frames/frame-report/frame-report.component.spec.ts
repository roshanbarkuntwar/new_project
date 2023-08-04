import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameReportComponent } from './frame-report.component';

describe('FrameReportComponent', () => {
  let component: FrameReportComponent;
  let fixture: ComponentFixture<FrameReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameReportComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
