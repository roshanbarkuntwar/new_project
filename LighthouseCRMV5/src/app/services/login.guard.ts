import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalObjectsService } from './global-objects.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private globalObject:GlobalObjectsService){}

  canActivate(): boolean  {
    let user = this.globalObject.getLocallData("userDetails");
    if(user){
      return false;
    }else{
      return true;
    }
  }
  
}
