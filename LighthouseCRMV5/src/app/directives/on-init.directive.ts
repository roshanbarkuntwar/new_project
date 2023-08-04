import { Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[ngInit]'
})
export class OnInitDirective implements OnInit {
  @Output()
  ngInit: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    setTimeout(() => this.ngInit.emit(), 5);
  }

  constructor() { }

}
