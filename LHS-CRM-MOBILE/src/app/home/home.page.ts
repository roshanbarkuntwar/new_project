import { Component } from '@angular/core';
import { BackgroundService } from '../services/background.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private backgroundProvider : BackgroundService) {}

  

}
