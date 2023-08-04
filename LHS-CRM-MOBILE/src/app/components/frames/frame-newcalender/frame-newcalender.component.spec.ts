import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameNewcalenderComponent } from './frame-newcalender.component';

describe('FrameNewcalenderComponent', () => {
  let component: FrameNewcalenderComponent;
  let fixture: ComponentFixture<FrameNewcalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameNewcalenderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameNewcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
