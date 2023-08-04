import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-rating-input',
  templateUrl: './rating-input.component.html',
  styleUrls: ['./rating-input.component.scss'],
})
export class RatingInputComponent implements OnInit {
  @Input() ratinginput: any;

  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  stars: string[] = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"];
  numStars: any = 5;
  ratingValue: any;
  constructor(private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    console.log(this.ratinginput.value);
    this.calc((this.ratinginput.value != null && this.ratinginput.value > 0) ? this.ratinginput.value : 0);
  }

  //ngAfterViewInit() {
    //this.calc(this.ratinginput.value > 0 ? this.ratinginput.value : 0);
  //}
  onChange(onChange) {
      this.emitOnChange.emit(this.ratinginput)
  }

  calc(value) {
    this.stars = [];
    let tmp = value;
    for (let i = 0; i < this.numStars; i++ , tmp--) {
      if (tmp >= 1)
        this.stars[i] = "star";
      else
        this.stars[i] = "star-outline";
    }
  }


  setRating(value, itemDbName) {
    this.ratinginput.value = value;
    if (this.ratinginput.tool_tip) {
      if (this.ratinginput.tool_tip.indexOf("#") > -1) {
        let ratingMsg: any = this.ratinginput.tool_tip.split("#");
        this.ratingValue = ratingMsg[this.ratinginput.value - 1];
      }
    }
    this.calc(value);
  }

}
