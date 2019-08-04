import { Component } from '@angular/core';

import { AuthenticationService, } from './_services/service/authentication.service';
import { IUser } from './_services/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'JenniferRK';
  currentUser: IUser;
  constructor(
    //private authenticationService: AuthenticationService,
  ) {
    //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // designed by radhakrishnan jG
  }
}
