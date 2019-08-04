import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/service/authentication.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    public routename: string = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        this.routename = route.routeConfig.path;
        // if (currentUser.Email == 'radhakrishnanjg@gmail.com') {
        //     return true;
        // }
        if (currentUser != null) {
            if (currentUser.lstUserPermission != null && currentUser.lstUserPermission.length != 0) {
                const Routestring = currentUser.lstUserPermission.filter(a =>
                    a.AngularRouteName == this.routename && (a.Permission == "View" || a.Permission == "ViewEdit"));
                if (Routestring.length != 0) {
                    // authorised so return true      
                    return true;
                }
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/Signin']);// { queryParams: { returnUrl: state.url }}
        return false;
    }
    isInArray(array, word) {
        return array.indexOf(word.toLowerCase()) > -1;
    }
}