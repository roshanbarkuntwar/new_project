import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameMapComponent } from './frame-map.component';

describe('FrameMapComponent', () => {
  let component: FrameMapComponent;
  let fixture: ComponentFixture<FrameMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameMapComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
