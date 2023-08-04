import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-news-scroll',
  templateUrl: './news-scroll.component.html',
  styleUrls: ['./news-scroll.component.scss'],
})
export class NewsScrollComponent implements OnInit {
  @Input() newsscroll:any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  marqueeText= "Welcome To Lighthouse Info Systems Pvt. Ltd";
  date = new Date();
  constructor() { }

  ngOnInit(){
    console.log(this.newsscroll)
  }
  itemClick(event) {
    this.emitPass.emit(this.newsscroll);
  }

}
