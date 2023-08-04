import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frame-smart-filter-sliding-buttons',
  templateUrl: './frame-smart-filter-sliding-buttons.component.html',
  styleUrls: ['./frame-smart-filter-sliding-buttons.component.scss'],
})
export class FrameSmartFilterSlidingButtonsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
 
  onButtonGroupClick($event){
    
    let clickedElement = $event.target || $event.srcElement;
      
    if( clickedElement.nodeName === "ION-BUTTON" ) {
      let elemClasses = (clickedElement as HTMLIonButtonElement).classList;
      
      let isActive = elemClasses.contains("active");
      
      if( isActive ) {
        elemClasses.remove("active");
        elemClasses.add("inactive");
      }else{

        clickedElement.className += " active";
      }

    }

  }
}
