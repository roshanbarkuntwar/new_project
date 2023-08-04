import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameGeochartComponent } from './frame-geochart.component';

describe('FrameGeochartComponent', () => {
  let component: FrameGeochartComponent;
  let fixture: ComponentFixture<FrameGeochartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameGeochartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameGeochartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
