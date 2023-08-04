import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameOtpComponent } from './frame-otp.component';

describe('FrameOtpComponent', () => {
  let component: FrameOtpComponent;
  let fixture: ComponentFixture<FrameOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameOtpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
