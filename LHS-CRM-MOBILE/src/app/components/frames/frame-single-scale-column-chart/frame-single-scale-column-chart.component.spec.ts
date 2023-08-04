import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameSingleScaleColumnChartComponent } from './frame-single-scale-column-chart.component';

describe('FrameSingleScaleColumnChartComponent', () => {
  let component: FrameSingleScaleColumnChartComponent;
  let fixture: ComponentFixture<FrameSingleScaleColumnChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSingleScaleColumnChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameSingleScaleColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
