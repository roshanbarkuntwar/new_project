import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameHmlComponent } from './frame-hml.component';

describe('FrameHmlComponent', () => {
  let component: FrameHmlComponent;
  let fixture: ComponentFixture<FrameHmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameHmlComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameHmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
