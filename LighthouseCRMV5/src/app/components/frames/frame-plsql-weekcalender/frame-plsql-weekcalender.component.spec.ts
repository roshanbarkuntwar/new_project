import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FramePlsqlWeekcalenderComponent } from './frame-plsql-weekcalender.component';

describe('FramePlsqlWeekcalenderComponent', () => {
  let component: FramePlsqlWeekcalenderComponent;
  let fixture: ComponentFixture<FramePlsqlWeekcalenderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FramePlsqlWeekcalenderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FramePlsqlWeekcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
