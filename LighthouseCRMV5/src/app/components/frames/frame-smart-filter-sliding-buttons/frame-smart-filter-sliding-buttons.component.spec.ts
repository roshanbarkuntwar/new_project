import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSmartFilterSlidingButtonsComponent } from './frame-smart-filter-sliding-buttons.component';

describe('FrameSmartFilterSlidingButtonsComponent', () => {
  let component: FrameSmartFilterSlidingButtonsComponent;
  let fixture: ComponentFixture<FrameSmartFilterSlidingButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterSlidingButtonsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSmartFilterSlidingButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
