import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSmartFilterRangeComponent } from './frame-smart-filter-range.component';

describe('FrameSmartFilterRangeComponent', () => {
  let component: FrameSmartFilterRangeComponent;
  let fixture: ComponentFixture<FrameSmartFilterRangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterRangeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSmartFilterRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
