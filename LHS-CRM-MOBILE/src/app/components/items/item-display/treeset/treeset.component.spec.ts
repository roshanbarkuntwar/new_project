import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreesetComponent } from './treeset.component';

describe('TreesetComponent', () => {
  let component: TreesetComponent;
  let fixture: ComponentFixture<TreesetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreesetComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
