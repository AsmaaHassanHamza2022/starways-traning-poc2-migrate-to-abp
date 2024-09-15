import { ConfigStateService, CurrentUserDto  } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { User } from '@volo/abp.ng.identity/config/models/identity-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent{
  currentUser:CurrentUserDto ;

  constructor(private configStateService:ConfigStateService){
    this.currentUser=this.configStateService.getOne('currentUser');
    console.log("current User" , this.currentUser)


  }
  
}
