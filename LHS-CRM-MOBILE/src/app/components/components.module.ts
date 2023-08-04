import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FocusDirective, FrameCanvasComponent } from './frames/frame-canvas/frame-canvas.component';
import { FocusDirectiveEntryTable } from './frames/frame-table2/frame-table2.component';
import { FocusDirectiveCard } from './frames/frame-card/frame-card.component';
import { FrameCardComponent } from './frames/frame-card/frame-card.component';
import { FrameSummCardComponent } from './frames/frame-summ-card/frame-summ-card.component';

import { FrameTableComponent } from './frames/frame-table/frame-table.component';
import { frameCollapsComponent } from './frames/frame-collaps/frame-collaps.component';
import { FrameCalenderComponent } from './frames/frame-calender/frame-calender.component';
import { FrameGraphComponent } from './frames/frame-graph/frame-graph.component';
import { FrameFilterComponent } from './frames/frame-filter/frame-filter.component';
import { FrameTimelineCardComponent } from './frames/frame-timeline-card/frame-timeline-card.component';


import { FrameAddonComponent } from './frames/frame-addon/frame-addon.component';
import { FrameTermsConditionsComponent } from './frames/frame-terms-conditions/frame-terms-conditions.component';
import { ItemsComponent } from './items/items.component';
import { ButtonComponent } from './items/item-display/button/button.component';
import { ImageComponent } from './items/item-display/image/image.component';
import { ImageSliderComponent } from './items/item-display/image-slider/image-slider.component';
import { LabelComponent } from './items/item-display/label/label.component';
import { MenuListComponent } from './items/item-display/menu-list/menu-list.component';
import { MenuListThumbnailComponent } from './items/item-display/menu-list-thumbnail/menu-list-thumbnail.component';
import { MenuTabComponent } from './items/item-display/menu-tab/menu-tab.component';
import { NewsScrollComponent } from './items/item-display/news-scroll/news-scroll.component';
import { SlidingListComponent } from './items/item-display/sliding-list/sliding-list.component';
import { TextBandComponent } from './items/item-display/text-band/text-band.component';
import { TextBand2Component } from './items/item-display/text-band2/text-band2.component';
import { TextBand3Component } from './items/item-display/text-band3/text-band3.component';
import { DateInputComponent } from './items/item-input/date-input/date-input.component';
import { ImageInputComponent } from './items/item-input/image-input/image-input.component';
import { LOVInputComponent } from './items/item-input/lov-input/lov-input.component';
import { NumberInputComponent } from './items/item-input/number-input/number-input.component';
import { DateFilterInputComponent } from './items/item-input/date-filter-input/date-filter-input.component';
import { RatingInputComponent } from './items/item-input/rating-input/rating-input.component';
import { SelectInputComponent } from './items/item-input/select-input/select-input.component';
import { TextInputComponent } from './items/item-input/text-input/text-input.component';
import { TextareaInputComponent } from './items/item-input/textarea-input/textarea-input.component';
import { RepCardComponent } from './items/item-input/rep-card/rep-card.component';
import { VideoInputComponent } from './items/item-input/video-input/video-input.component';


import { DirectivesModule } from '../directives/directives.module';
import { ModalPageModule } from '../pages/modal/modal.module';
import { SingleSelectLovPageModule } from '../pages/single-select-lov/single-select-lov.module';
import { PopoverPageModule } from '../pages/popover/popover.module';
import { EmailInputComponent } from './items/item-input/email-input/email-input.component';
import { BarcodeInputComponent } from './items/item-input/barcode-input/barcode-input.component';
import { NgCalendarModule } from 'ionic2-calendar';
import { FrameCardSliderComponent } from './frames/frame-card-slider/frame-card-slider.component';
import { FrameLocationTrackingCardComponent } from './frames/frame-location-tracking-card/frame-location-tracking-card.component'

import { IonBadgesComponent } from './items/item-display/ion-badges/ion-badges.component';
import { FrameImgSliderComponent } from './frames/frame-img-slider/frame-img-slider.component';
import { FileTreeComponent } from './items/item-display/file-tree/file-tree.component';
import { ParaTextComponent } from './items/item-display/para-text/para-text.component';
import { PipesModule } from '../pipes/pipes.module';

import { TextBand4Component } from './items/item-display/text-band4/text-band4.component';
import { SummaryCardComponent } from './items/item-display/summary-card/summary-card.component';
import { FrameNewcalenderPipe } from './frames/frame-newcalender.pipe';
import { FrameNewcalenderComponent } from './frames/frame-newcalender/frame-newcalender.component';
import { CalendarModule } from 'ion2-calendar';
import { AttachFileComponent } from './items/item-input/attach-file/attach-file.component';
import { FrameEntryTableComponent } from './frames/frame-entry-table/frame-entry-table.component';
import { ApprovalTabComponent } from './frames/approval-tab/approval-tab.component';
import { FrameUserProfileComponent } from './frames/frame-user-profile/frame-user-profile.component';
import { FrameChatDashboardComponent } from './frames/frame-chat-dashboard/frame-chat-dashboard.component';
import { ChatRightComponent } from './items/item-display/chat-right/chat-right.component';
import { ChatLeftComponent } from './items/item-display/chat-left/chat-left.component';
import { FramePercentageCircleComponent } from './frames/frame-percentage-circle/frame-percentage-circle.component';
import { PercentageCircleComponent } from './items/item-display/percentage-circle/percentage-circle.component';
import { FrameDashboardGraphComponent } from './frames/frame-dashboard-graph/frame-dashboard-graph.component';
import { CheckBoxComponent } from './items/item-input/check-box/check-box.component';
import { DialerComponent } from './items/item-display/dialer/dialer.component';
import { ItemImageComponent } from './items/item-display/item-image/item-image.component';
import { EmailComposerComponent } from './items/item-display/email-composer/email-composer.component';
import { FrameSmartFilterSlidingButtonsComponent } from './frames/frame-smart-filter-sliding-buttons/frame-smart-filter-sliding-buttons.component';
import { FrameSmartFilterRangeComponent } from './frames/frame-smart-filter-range/frame-smart-filter-range.component';
import { FrameSmartFilterContainerComponent } from './frames/frame-smart-filter-container/frame-smart-filter-container.component';
import { FrameSmartFilterColumnComponent } from './frames/frame-smart-filter-column/frame-smart-filter-column.component';
import { FrameSmartFilterChecklistComponent } from './frames/frame-smart-filter-checklist/frame-smart-filter-checklist.component';
import { ChecklistFilterComponent } from './items/item-input/checklist-filter/checklist-filter.component';
import { SlidingFilterComponent } from './items/item-input/sliding-filter/sliding-filter.component';
import { IonchipFilterComponent } from './items/item-input/ionchip-filter/ionchip-filter.component';
import { ColumnFilterComponent } from './items/item-input/column-filter/column-filter.component';
import { RangeFilterComponent } from './items/item-input/range-filter/range-filter.component';
import { FrameCanvasFilterComponent } from './frames/frame-canvas-filter/frame-canvas-filter.component';
import { FrameMapComponent } from './frames/frame-map/frame-map.component';
import { ColumnCountComponent } from './items/item-display/column-count/column-count.component';
import { TwoDKPIComponent } from './items/item-display/two-d-kpi/two-d-kpi.component';
import { FrameTableKPIComponent } from './frames/frame-table-kpi/table-kpi.component';
import { FrameTaskManagementComponent } from './frames/frame-task-management/frame-task-management.component';
import { FrameAdvanceFilterComponent } from './frames/frame-advance-filter/frame-advance-filter.component';
import { FrameCartSummaryComponent } from './frames/frame-cart-summary/frame-cart-summary.component';
import { FrameAddToCartComponent } from './frames/frame-add-to-cart/frame-add-to-cart.component';
import { FrameOrderEntryComponent } from './frames/frame-order-entry/frame-order-entry.component';
import { FrameDependentFilterComponent } from './frames/frame-dependent-filter/frame-dependent-filter.component';
import { FramePlainKpiComponent } from './frames/frame-plain-kpi/frame-plain-kpi.component';
import { DisplayCountComponent } from './items/item-display/display-count/display-count.component';
import { InformationCardComponent } from './items/item-display/information-card/information-card.component';
import { FrameFooterComponent } from './frames/frame-footer/frame-footer.component';
import { FrameCartSummaryPlainComponent } from './frames/frame-cart-summary-plain/frame-cart-summary-plain.component';
import { FrameSummaryCardComponent } from './frames/frame-summary-card/frame-summary-card.component';
  import { FrameTableCardComponent } from './frames/frame-table-card/frame-table-card.component';
import { FrameSummaryCardDetailComponent } from './frames/frame-summary-card-detail/frame-summary-card-detail.component';
import { ProgressBarComponent } from './items/item-display/progress-bar/progress-bar.component';
import { FrameDragDropComponent } from './frames/frame-drag-drop/frame-drag-drop.component';
import { ImageInputCircleComponent } from './items/item-input/image-input-circle/image-input-circle.component';
import { ImageMenuComponent } from './items/item-display/image-menu/image-menu.component';
import { IconMenuComponent } from './items/item-display/icon-menu/icon-menu.component';
import { SimpleKpiComponent } from './items/item-display/simple-kpi/simple-kpi.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FrameGroupTableComponent } from './frames/frame-group-table/frame-group-table.component';
import { FrameRouteMapComponent } from './frames/frame-route-map/frame-route-map.component';
import { FrameTable2Component } from './frames/frame-table2/frame-table2.component';
import { FrameTreemapComponent } from './frames/frame-treemap/frame-treemap.component';
import { FramePiechartComponent } from './frames/frame-piechart/frame-piechart.component';
import { FrameDoughnoutComponent } from './frames/frame-doughnout/frame-doughnout.component';
import { FrameBarComponent } from './frames/frame-bar/frame-bar.component';
import { FrameScattechartComponent } from './frames/frame-scattechart/frame-scattechart.component';
import { FrameProfileInfoComponent } from './frames/frame-profile-info/frame-profile-info.component';
import { FrameCandlestickchartComponent } from './frames/frame-candlestickchart/frame-candlestickchart.component';
import { FrameHmlComponent } from './frames/frame-hml/frame-hml.component';
import { ChatListComponent } from './frames/chat-list/chat-list.component';
import { FrameKpiSliderComponent } from './frames/frame-kpi-slider/frame-kpi-slider.component';
import { KpiSliderComponent } from  './items/item-display/kpi-slider/kpi-slider.component';
import { FabBallComponent } from './frames/fab-ball/fab-ball.component';
import { FrameColumnChartComponent } from './frames/frame-column-chart/frame-column-chart.component';
import { FrameFunnelgraphComponent }  from './frames/frame-funnelgraph/frame-funnelgraph.component';
import {SubSelectInputComponent } from './items/item-input/sub-select-input/sub-select-input.component';
import { FrameSubSelectComponent } from './frames/frame-sub-select/frame-sub-select.component';
import { FrameOrderCardComponent } from './frames/frame-order-card/frame-order-card.component';
import { FrameParentChildOrderComponent } from './frames/frame-parent-child-order/frame-parent-child-order.component';
import { ToogleSwitchComponent } from './items/item-display/toogle-switch/toogle-switch.component';
import { BarHorizontalGraphComponent } from './frames/bar-horizontal-graph/bar-horizontal-graph.component';
import { DownloadDocComponent } from './items/item-display/download-doc/download-doc.component';
import { FrameOtpComponent } from './frames/frame-otp/frame-otp.component';
import { FrameWaypointsComponent } from './frames/frame-waypoints/frame-waypoints.component';
import { FramePlsqlCalenderComponent } from './frames/frame-plsql-calender/frame-plsql-calender.component';
import { NewMenuListComponent } from './items/item-display/new-menu-list/new-menu-list.component';
import { FramePlsqlWeekcalenderComponent } from './frames/frame-plsql-weekcalender/frame-plsql-weekcalender.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FrameCalenderMonthComponent } from './frames/frame-calender-month/frame-calender-month.component';
import { EventintheCalenderComponent } from './frames/eventinthe-calender/eventinthe-calender.component';
import { FrameLineGraphComponent } from './frames/frame-line-graph/frame-line-graph.component';
import { UploadButtonComponent } from './items/item-display/upload-button/upload-button.component';
import { FramePopupComponent } from './frames/frame-popup/frame-popup.component';
import { DevItemIconComponent } from './items/item-display/dev-item-icon/dev-item-icon.component';
import { DevClickEventStrComponent } from './items/item-display/dev-click-event-str/dev-click-event-str.component';
import { FrameTableVerticalComponent } from './frames/frame-table-vertical/frame-table-vertical.component';
import { TreesetComponent } from './items/item-display/treeset/treeset.component';
import { FrameCalendarWeekComponent } from './frames/frame-calendar-week/frame-calendar-week.component';
import { FrameApexfilterComponent } from './frames/frame-apexfilter/frame-apexfilter.component';
import { FlipKpiComponent } from './items/item-display/flip-kpi/flip-kpi.component';
import { FrameCollapseOrderEntryComponent } from './frames/frame-collapse-order-entry/frame-collapse-order-entry.component'
import { FramePlastoSummaryCardComponent } from './frames/frame-plasto-summary-card/frame-plasto-summary-card.component'
import { TooltipsModule } from 'ionic-tooltips';
import { VideoStreamComponent } from './items/item-display/video-stream/video-stream.component';
import { FrameGeochartComponent } from './frames/frame-geochart/frame-geochart.component';
import { FrameTravelLocationComponent } from './frames/frame-travel-location/frame-travel-location.component';
import { PartitionItemComponent } from './items/item-display/partition-item/partition-item.component';
import { DragDropDirective } from '../directives/drag-drop.directive';
import { FramePivotTableComponent } from './frames/frame-pivot-table/frame-pivot-table.component';
import { FrameMultilevelTableComponent } from './frames/frame-multilevel-table/frame-multilevel-table.component';
import { TreemenuComponent } from './items/item-display/treemenu/treemenu.component';
import { FrameThreeDFunnelComponent } from './frames/frame-three-d-funnel/frame-three-d-funnel.component';
import { FrameReportComponent } from './frames/frame-report/frame-report.component';
import { MultitaskTreemenuComponent } from './items/item-display/multitask-treemenu/multitask-treemenu.component';
import { FrameSingleScaleColumnChartComponent } from './frames/frame-single-scale-column-chart/frame-single-scale-column-chart.component';
import { FrameTreeTableComponent } from './frames/frame-tree-table/frame-tree-table.component';
import {TreeTableModule} from 'primeng/treetable';
import {TableModule} from 'primeng/table';
import { FramePivotTable2Component } from './frames/frame-pivot-table2/frame-pivot-table2.component';
import { FrameImgMiniSliderComponent } from './frames/frame-img-mini-slider/frame-img-mini-slider.component';
import { InputScannerComponent } from './items/item-input/input-scanner/input-scanner.component';
import { BarcodeScannerComponent } from './items/item-input/barcode-scanner/barcode-scanner.component';
import { BluetoothDeviceComponent } from './items/item-input/bluetooth-device/bluetooth-device.component';
// import {BadgeModule} from 'primeng/badge';

// import { FrameSmartFilterSlidingButtonsComponent } from './frames/frame-smart-filter-sliding-buttons/frame-smart-filter-sliding-buttons.component';
// import { FrameSmartFilterRangeComponent } from './frames/frame-smart-filter-range/frame-smart-filter-range.component';
// import { FrameSmartFilterColumnComponent } from './frames/frame-smart-filter-column/frame-smart-filter-column.component';
// import { FrameSmartFilterChecklistComponent } from './frames/frame-smart-filter-checklist/frame-smart-filter-checklist.component';





// import { TableSearchPipe } from '../pipes/table-search.pipe';




@NgModule({
  declarations: [FrameCanvasComponent, FrameCardComponent, FrameSummCardComponent, FrameTableComponent, frameCollapsComponent,
    ItemsComponent, FrameCalenderComponent, FrameGraphComponent, FrameFilterComponent, FrameCardSliderComponent, FrameUserProfileComponent,
    ButtonComponent, ImageComponent, ImageSliderComponent, LabelComponent, ChatListComponent, FrameChatDashboardComponent,FrameSubSelectComponent,
    MenuListComponent, MenuListThumbnailComponent, MenuTabComponent, RepCardComponent, ChatRightComponent, ChatLeftComponent,
    NewsScrollComponent, SlidingListComponent, TextBandComponent, TextBand2Component, TextBand3Component, TextBand4Component, EmailInputComponent, ParaTextComponent, VideoInputComponent,
    DateInputComponent, ImageInputComponent, LOVInputComponent, NumberInputComponent, DateFilterInputComponent,FrameGroupTableComponent,
    RatingInputComponent, SelectInputComponent, TextInputComponent, TextareaInputComponent, BarcodeInputComponent,SubSelectInputComponent,
    IonBadgesComponent, FrameImgSliderComponent, FileTreeComponent, SlidingListComponent,FrameFunnelgraphComponent,
    FrameTermsConditionsComponent, FrameAddonComponent, SummaryCardComponent, FrameNewcalenderPipe, FrameNewcalenderComponent, FramePercentageCircleComponent, AttachFileComponent, FrameEntryTableComponent,
    ApprovalTabComponent, PercentageCircleComponent, FrameDashboardGraphComponent, CheckBoxComponent, DialerComponent, ItemImageComponent, EmailComposerComponent,
    FrameSmartFilterSlidingButtonsComponent, FrameSmartFilterRangeComponent, FrameSmartFilterContainerComponent,
    FrameSmartFilterColumnComponent, FrameSmartFilterChecklistComponent,FrameColumnChartComponent,
    ChecklistFilterComponent, SlidingFilterComponent, ColumnFilterComponent, RangeFilterComponent,BarHorizontalGraphComponent,
    IonchipFilterComponent, FrameCanvasFilterComponent, ColumnCountComponent, TwoDKPIComponent, FrameTableKPIComponent,ProgressBarComponent,
   FrameMapComponent, FrameTaskManagementComponent, FrameAdvanceFilterComponent, FrameCartSummaryComponent, FrameAddToCartComponent, FrameTimelineCardComponent,
    FrameDependentFilterComponent, FramePlainKpiComponent, InformationCardComponent, FrameLocationTrackingCardComponent, FrameOrderEntryComponent, DisplayCountComponent
    ,FrameFooterComponent,FrameCartSummaryPlainComponent,FrameSummaryCardComponent ,FrameTableCardComponent , FrameSummaryCardDetailComponent,FrameDragDropComponent
  ,ImageInputCircleComponent,ImageMenuComponent,IconMenuComponent,SimpleKpiComponent, FrameRouteMapComponent
,FrameTable2Component ,FrameTreemapComponent,FramePiechartComponent,FrameDoughnoutComponent,FrameBarComponent,FrameScattechartComponent
,FrameProfileInfoComponent,FrameCandlestickchartComponent,FrameHmlComponent,FrameKpiSliderComponent,KpiSliderComponent,FabBallComponent,SubSelectInputComponent,FrameOrderCardComponent,FrameParentChildOrderComponent,
ToogleSwitchComponent,DownloadDocComponent,FrameOtpComponent,FrameWaypointsComponent,FramePlsqlCalenderComponent,NewMenuListComponent,FramePlsqlWeekcalenderComponent,
FrameCalenderMonthComponent,EventintheCalenderComponent,FrameLineGraphComponent,UploadButtonComponent,FramePopupComponent, DevItemIconComponent,DevClickEventStrComponent,FrameTableVerticalComponent,
TreesetComponent,FrameApexfilterComponent,FlipKpiComponent,FrameCollapseOrderEntryComponent,FramePlastoSummaryCardComponent,FocusDirective,FocusDirectiveEntryTable,FocusDirectiveCard,VideoStreamComponent,FrameGeochartComponent,FrameTravelLocationComponent,InputScannerComponent,
PartitionItemComponent,FramePivotTableComponent,FrameThreeDFunnelComponent, FrameTreeTableComponent,FramePivotTable2Component,FrameImgMiniSliderComponent
,DragDropDirective,FrameMultilevelTableComponent,TreemenuComponent,FrameReportComponent,FrameAddonComponent,MultitaskTreemenuComponent,FrameSingleScaleColumnChartComponent,BarcodeScannerComponent,BluetoothDeviceComponent,
],entryComponents: [],
  imports: [
    CommonModule,
    
    TooltipsModule.forRoot(),
    FormsModule, NgCalendarModule, CalendarModule,TableModule,TreeTableModule,
    IonicModule, DirectivesModule, ModalPageModule, SingleSelectLovPageModule, PopoverPageModule,
    PipesModule, DragDropModule, AngularMyDatePickerModule,  //BadgeModule
   
  ],
  exports: [FrameCanvasComponent, FrameCardComponent, FrameSummCardComponent, FrameTableComponent, frameCollapsComponent,FrameGroupTableComponent,
    ItemsComponent, FrameCalenderComponent, FrameGraphComponent, FrameFilterComponent, FrameCardSliderComponent, FrameUserProfileComponent, ChatListComponent,
    ButtonComponent, ImageComponent, ImageSliderComponent, LabelComponent, ParaTextComponent, FrameChatDashboardComponent,
    MenuListComponent, MenuListThumbnailComponent, MenuTabComponent, RepCardComponent, ChatRightComponent, ChatLeftComponent,
    NewsScrollComponent, SlidingListComponent, TextBandComponent, TextBand2Component, TextBand3Component, TextBand4Component, EmailInputComponent, VideoInputComponent,
    DateInputComponent, ImageInputComponent, LOVInputComponent, NumberInputComponent, DateFilterInputComponent,FrameSubSelectComponent,
    BarcodeInputComponent, IonBadgesComponent, FrameImgSliderComponent, FileTreeComponent, FramePercentageCircleComponent,ProgressBarComponent,
    RatingInputComponent, SelectInputComponent, TextInputComponent, TextareaInputComponent, SlidingListComponent,
    FrameTermsConditionsComponent, FrameAddonComponent, SummaryCardComponent, FrameNewcalenderComponent, AttachFileComponent, FrameEntryTableComponent, ApprovalTabComponent, PercentageCircleComponent,
    FrameDashboardGraphComponent, CheckBoxComponent, DialerComponent, ItemImageComponent, EmailComposerComponent,
    FrameSmartFilterSlidingButtonsComponent, FrameSmartFilterRangeComponent, FrameSmartFilterContainerComponent,
    FrameSmartFilterColumnComponent, FrameSmartFilterChecklistComponent,FrameColumnChartComponent,SubSelectInputComponent,
    ChecklistFilterComponent, SlidingFilterComponent, ColumnFilterComponent, RangeFilterComponent,FrameFunnelgraphComponent,
    IonchipFilterComponent, FrameCanvasFilterComponent, ColumnCountComponent, FrameTableKPIComponent, FrameTaskManagementComponent,
    IonchipFilterComponent, FrameCanvasFilterComponent, FrameMapComponent, InformationCardComponent, ProgressBarComponent,FramePivotTable2Component,
    ColumnCountComponent, TwoDKPIComponent, FrameAdvanceFilterComponent, FrameCartSummaryComponent, FrameAddToCartComponent, FrameTimelineCardComponent, FrameLocationTrackingCardComponent, FrameOrderEntryComponent
    , FrameDependentFilterComponent, FramePlainKpiComponent, DisplayCountComponent, FrameFooterComponent,FrameCartSummaryPlainComponent,FrameSummaryCardComponent ,FrameTableCardComponent , FrameSummaryCardDetailComponent,FrameDragDropComponent
  ,ImageInputCircleComponent,ImageMenuComponent,IconMenuComponent,SimpleKpiComponent,FrameBarComponent,FrameTable2Component,FrameTreeTableComponent,
  FrameRouteMapComponent,FramePiechartComponent,FrameDoughnoutComponent,FrameTreemapComponent,FrameScattechartComponent,BarHorizontalGraphComponent
,FrameProfileInfoComponent,FrameCandlestickchartComponent, FrameHmlComponent,FrameKpiSliderComponent,KpiSliderComponent,FabBallComponent,SubSelectInputComponent,FrameOrderCardComponent,FrameParentChildOrderComponent,FramePlastoSummaryCardComponent

,ToogleSwitchComponent,DownloadDocComponent,FrameOtpComponent,FrameWaypointsComponent,FramePlsqlCalenderComponent,NewMenuListComponent,FramePlsqlWeekcalenderComponent,
FrameCalenderMonthComponent,EventintheCalenderComponent,FrameLineGraphComponent,UploadButtonComponent,FramePopupComponent,DevItemIconComponent,DevClickEventStrComponent,FrameTableVerticalComponent,
TreesetComponent,FrameApexfilterComponent,FlipKpiComponent,FrameCollapseOrderEntryComponent,FocusDirective,FocusDirectiveEntryTable,FocusDirectiveCard,VideoStreamComponent,FrameGeochartComponent,FrameTravelLocationComponent,PartitionItemComponent,FramePivotTableComponent,FrameMultilevelTableComponent,TreemenuComponent,FrameThreeDFunnelComponent
,FrameReportComponent,MultitaskTreemenuComponent,FrameSingleScaleColumnChartComponent, FrameImgMiniSliderComponent,InputScannerComponent,BarcodeScannerComponent, BluetoothDeviceComponent
]

})
export class ComponentsModule { }
