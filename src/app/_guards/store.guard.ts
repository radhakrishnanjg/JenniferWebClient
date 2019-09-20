import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/service/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class StoreGuard implements CanActivate {
    public routename: string = '';

    constructor(
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
        return true
    }
}