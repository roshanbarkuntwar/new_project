import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSmartFilterColumnComponent } from './frame-smart-filter-column.component';

describe('FrameSmartFilterColumnComponent', () => {
  let component: FrameSmartFilterColumnComponent;
  let fixture: ComponentFixture<FrameSmartFilterColumnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSmartFilterColumnComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSmartFilterColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
