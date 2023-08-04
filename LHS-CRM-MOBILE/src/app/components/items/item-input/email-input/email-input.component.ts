import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss'],
})
export class EmailInputComponent implements OnInit {



  @Input() emailinput: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  constructor(private emailComposer: EmailComposer, private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    console.log("emailinput...>>>", this.emailinput)
    var str = this.emailinput.position;
    if(str != null){
      var style = str.split("~");
      console.log("style", style[0]);
    }
   


    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if (this.emailinput.item_sub_type == 'EMAIL_COMPOSER') {
      this.emailinput.value = this.emailinput.item_default_value ? this.emailinput.item_default_value : this.emailinput.value;
    }
  }


  onChange(onChange) {
      this.emitOnChange.emit(this.emailinput)
  }

  cleardata() {
    this.emailinput.value= "";
  }

  emailcomposer(emailinput) {
    let email = {
      to: emailinput,
      cc: [],
      bcc: [],
      attachments: [],
      // subject: this.subject,
      // body: this.body,
      isHtml: true
    }
    this.emailComposer.open(email);
  }

}
