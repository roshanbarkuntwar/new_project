import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramePlsqlWeekcalenderComponent } from './frame-plsql-weekcalender.component';

describe('FramePlsqlWeekcalenderComponent', () => {
  let component: FramePlsqlWeekcalenderComponent;
  let fixture: ComponentFixture<FramePlsqlWeekcalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramePlsqlWeekcalenderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramePlsqlWeekcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
