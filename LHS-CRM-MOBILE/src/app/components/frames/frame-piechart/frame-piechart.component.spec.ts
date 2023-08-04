import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramePiechartComponent } from './frame-piechart.component';

describe('FramePiechartComponent', () => {
  let component: FramePiechartComponent;
  let fixture: ComponentFixture<FramePiechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramePiechartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramePiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
