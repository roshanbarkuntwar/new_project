import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DevImageIconMastEditorPage } from './dev-image-icon-mast-editor.page';

describe('DevImageIconMastEditorPage', () => {
  let component: DevImageIconMastEditorPage;
  let fixture: ComponentFixture<DevImageIconMastEditorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevImageIconMastEditorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DevImageIconMastEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
