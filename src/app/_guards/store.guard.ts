import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services/service/authentication.service';

import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class StoreGuard implements CanActivate {
    public routename: string = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private _alertService: ToastrService,

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        this.routename = route.routeConfig.path;  
        if (currentUser.CompanyID == 0 || currentUser.CompanyID == undefined || currentUser.CompanyDetailID == 0 || currentUser.CompanyDetailID == undefined) {
            this._alertService.warning('Please select the store name in right top corner.!');
            return false;
        }
        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/Dashboard1']); 
        return true
    }
    isInArray(array, word) {
        return array.indexOf(word.toLowerCase()) > -1;
    }
}