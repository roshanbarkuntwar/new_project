import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameCandlestickchartComponent } from './frame-candlestickchart.component';

describe('FrameCandlestickchartComponent', () => {
  let component: FrameCandlestickchartComponent;
  let fixture: ComponentFixture<FrameCandlestickchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameCandlestickchartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameCandlestickchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
