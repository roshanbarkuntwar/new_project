import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameBarComponent } from './frame-bar.component';

describe('FrameBarComponent', () => {
  let component: FrameBarComponent;
  let fixture: ComponentFixture<FrameBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameBarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
