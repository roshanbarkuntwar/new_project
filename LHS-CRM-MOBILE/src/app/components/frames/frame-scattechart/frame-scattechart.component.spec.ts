import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameScattechartComponent } from './frame-scattechart.component';

describe('FrameScattechartComponent', () => {
  let component: FrameScattechartComponent;
  let fixture: ComponentFixture<FrameScattechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameScattechartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameScattechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
