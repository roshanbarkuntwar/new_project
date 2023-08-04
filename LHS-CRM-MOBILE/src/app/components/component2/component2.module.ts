import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameCalendarWeekComponent } from '../frames/frame-calendar-week/frame-calendar-week.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DemoUtilsModule } from 'src/app/demo-utils/module';
@NgModule({
  declarations: [FrameCalendarWeekComponent],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    DemoUtilsModule
  ],
  exports:[FrameCalendarWeekComponent]
})
export class Component2Module { }
