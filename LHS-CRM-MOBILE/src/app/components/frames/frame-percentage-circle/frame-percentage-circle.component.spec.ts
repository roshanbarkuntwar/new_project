import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramePercentageCircleComponent } from './frame-percentage-circle.component';

describe('FramePercentageCircleComponent', () => {
  let component: FramePercentageCircleComponent;
  let fixture: ComponentFixture<FramePercentageCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramePercentageCircleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramePercentageCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
