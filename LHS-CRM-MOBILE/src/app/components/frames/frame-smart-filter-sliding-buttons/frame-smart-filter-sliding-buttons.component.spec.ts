import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameSmartFilterSlidingButtonsComponent } from './frame-smart-filter-sliding-buttons.component';

describe('FrameSmartFilterSlidingButtonsComponent', () => {
  let component: FrameSmartFilterSlidingButtonsComponent;
  let fixture: ComponentFixture<FrameSmartFilterSlidingButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterSlidingButtonsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameSmartFilterSlidingButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
