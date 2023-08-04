import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FocusDirectiveLogin, LoginPage } from './login.page';
import { ComponentsModule } from '../../components/components.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ComponentsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [FocusDirectiveLogin,LoginPage],
  exports:[FocusDirectiveLogin]
})
export class LoginPageModule { }
