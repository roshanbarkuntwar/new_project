import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameApexfilterComponent } from './frame-apexfilter.component';

describe('FrameApexfilterComponent', () => {
  let component: FrameApexfilterComponent;
  let fixture: ComponentFixture<FrameApexfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameApexfilterComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameApexfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
