import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageIconMasterPage } from './image-icon-master.page';

describe('ImageIconMasterPage', () => {
  let component: ImageIconMasterPage;
  let fixture: ComponentFixture<ImageIconMasterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageIconMasterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageIconMasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
