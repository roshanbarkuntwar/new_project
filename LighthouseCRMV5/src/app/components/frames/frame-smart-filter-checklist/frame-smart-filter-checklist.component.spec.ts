import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSmartFilterChecklistComponent } from './frame-smart-filter-checklist.component';

describe('FrameSmartFilterChecklistComponent', () => {
  let component: FrameSmartFilterChecklistComponent;
  let fixture: ComponentFixture<FrameSmartFilterChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterChecklistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSmartFilterChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
