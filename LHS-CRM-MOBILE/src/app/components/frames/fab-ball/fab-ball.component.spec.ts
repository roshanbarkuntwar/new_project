import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabBallComponent } from './fab-ball.component';

describe('FabBallComponent', () => {
  let component: FabBallComponent;
  let fixture: ComponentFixture<FabBallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabBallComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
