import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {

  @Input() pbarinput :any = {}
  color: string;
  pbarValue: any;
  constructor() { }

  ngOnInit() {
    console.log('ProgressBarComponent')
    
    if (this.pbarinput.value) {
      this.pbarValue = this.pbarinput.value.split("@")[0];
      this.color = this.pbarinput.value.split("@")[1];
    } else {
      this.pbarValue.value = [];
    }
    
    // if(this.pbarinput.value <= 20){
    // this.color = 'primary';
    // }else if(this.pbarinput.value >20 && this.pbarinput.value <=40){
    //   this.color = this.pbarinput.value.split("@")[1]; 
    //   this.pbarValue.value = this.pbarinput.value.split("@")[0];
    // }else if(this.pbarinput.value >40 && this.pbarinput.value <=60){
    //   this.color = 'warning'; 
    // }else if(this.pbarinput.value >60 && this.pbarinput.value <=80){
    //   this.color = 'danger'; 
    // }else if(this.pbarinput.value >80 && this.pbarinput.value <=100){
    //   this.color = 'success'; 
    // }else{
    //   this.color = 'info';
    // }
  }
}
