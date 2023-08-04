import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-percentage-circle',
  templateUrl: './percentage-circle.component.html',
  styleUrls: ['./percentage-circle.component.scss'],
})
export class PercentageCircleComponent implements OnInit {

  @Input() pcircleinput: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  classPercentageVar: any;
  colorOfRing:string;
  constructor() { }

  ngOnInit() {
    console.log("PercentageCircleComponent ", this.pcircleinput);
    console.log("PercentageCircleComponent ", this.pcircleinput.value);
    this.classPercentageVar = Math.floor(this.pcircleinput.value);
   
    if(this.classPercentageVar>=70){
       this.colorOfRing="green";
    }else if(this.classPercentageVar<70 && this.classPercentageVar>50){
      this.colorOfRing="orange";
    }else if(this.classPercentageVar<50){
      this.colorOfRing="red";
    }
  }

  itemClick() {
    this.emitPass.emit(this.pcircleinput);
  }


}
