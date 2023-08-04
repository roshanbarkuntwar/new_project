import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frame-smart-filter-range',
  templateUrl: './frame-smart-filter-range.component.html',
  styleUrls: ['./frame-smart-filter-range.component.scss'],
})
export class FrameSmartFilterRangeComponent implements OnInit {
  range: number = 50;
  constructor() { }

  ngOnInit() { }

}
