import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frame-smart-filter-column',
  templateUrl: './frame-smart-filter-column.component.html',
  styleUrls: ['./frame-smart-filter-column.component.scss'],
})
export class FrameSmartFilterColumnComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  onColumnClick($event: { target: any; }) {
    let clickedElement = $event.target;
    if (clickedElement.nodeName === "ION-COL") {
      let elemClasses = (clickedElement as HTMLIonColElement).classList;
      let isActive = elemClasses.contains("activeColumn");
      if (isActive) {
        elemClasses.remove("activeColumn");
        elemClasses.add("inactiveColumn");
      } else {
        clickedElement.className += " activeColumn";
      }
    }
  }

}
