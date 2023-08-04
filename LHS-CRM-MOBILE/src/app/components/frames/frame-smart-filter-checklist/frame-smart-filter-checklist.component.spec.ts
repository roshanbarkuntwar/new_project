import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameSmartFilterChecklistComponent } from './frame-smart-filter-checklist.component';

describe('FrameSmartFilterChecklistComponent', () => {
  let component: FrameSmartFilterChecklistComponent;
  let fixture: ComponentFixture<FrameSmartFilterChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterChecklistComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameSmartFilterChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
