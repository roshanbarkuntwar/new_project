import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'sql-formatter';
@Component({
  selector: 'app-dev-frame-mast-editor',
  templateUrl: './dev-frame-mast-editor.page.html',
  styleUrls: ['./dev-frame-mast-editor.page.scss'],
})
export class DevFrameMastEditorPage implements OnInit {

  @Input() data: any;

  constructor(private modalctrl: ModalController) { }

  ngOnInit() {
    console.log(this.data);
  }
  beautify_sql_text(data) {
    this.data.sql_text = format(data, {
      language: 'plsql',
      uppercase: true,
    });
  }
  minifier_sql_text(text) {
    this.data.sql_text = text.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")");
  }
  beautify_pl_sql_text(data) {
    this.data.pl_sql_text = format(data, {
      language: 'plsql',
      uppercase: true,
    });
  }

  minifier_pl_sql_text(text) {
    this.data.pl_sql_text = text.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")");
  }





  closePage() {
    this.modalctrl.dismiss();
  }

}
