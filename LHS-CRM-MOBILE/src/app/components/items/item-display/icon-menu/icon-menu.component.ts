import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-menu',
  templateUrl: './icon-menu.component.html',
  styleUrls: ['./icon-menu.component.scss'],
})
export class IconMenuComponent implements OnInit {
  @Input() iconMenu : any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    if(!this.iconMenu.apps_icon_name){
      this.iconMenu.apps_icon_name = "aperture";
    }
    if(!this.iconMenu.css_class){
      this.iconMenu.css_class = "bg-blue";
    }
  }

  itemClicked(event){
    this.emitPass.emit(event);
  }

}
