import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSmartFilterContainerComponent } from './frame-smart-filter-container.component';

describe('FrameSmartFilterContainerComponent', () => {
  let component: FrameSmartFilterContainerComponent;
  let fixture: ComponentFixture<FrameSmartFilterContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterContainerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSmartFilterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
