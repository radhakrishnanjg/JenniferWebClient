import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AppConfig } from '../../assets/AppConfig.model';
import { AppConfig } from '../../assets/AppConfig.model';
@Injectable({ providedIn: 'root' })
export class MaintenanceGuard implements CanActivate {
    public routename: string = '';

    constructor(
        private router: Router,

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let appmode = AppConfig.AppMode;
        
        if (appmode == 'Offline') {
            this.router.navigate(['/Maintenance']);
            return false;
        }
        return true;
    }
}