import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameCollapseOrderEntryComponent } from './frame-collapse-order-entry.component';

describe('FrameCollapseOrderEntryComponent', () => {
  let component: FrameCollapseOrderEntryComponent;
  let fixture: ComponentFixture<FrameCollapseOrderEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameCollapseOrderEntryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameCollapseOrderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
