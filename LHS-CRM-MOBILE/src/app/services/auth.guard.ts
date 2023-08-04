import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Events } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalObjectsService } from './global-objects.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private globalObject:GlobalObjectsService, private events:Events){}

  canActivate(): boolean  {
    let user = this.globalObject.getLocallData("userDetails");
    let loginflag = this.globalObject.getLocallData("loginFlag");
    if(user && loginflag){
      return true;
    }else{
      this.events.publish("logOut");
      return false;
    }
   }
   
 
  
  
}
