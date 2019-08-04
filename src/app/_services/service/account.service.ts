import { Injectable } from '@angular/core';
import { IUser,  CompanyRegister, Result } from '../model/index';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })

export class AccountService {
    users: IUser[];
    objCompanyRegister: CompanyRegister;
    flag: boolean;
    constructor(private httpClient: HttpClient,
        private deviceService: DeviceDetectorService) {
    }


    isEmailRegisterd(username: string) {
        return this.httpClient.get<string>(environment.baseUrl + `Account/EmailIdExistance?EmailId=` + username)
            .pipe(map(users => {
                if (users && users == 'Success')
                    return true;
                else
                    return false;
            })
            );
    }

    SendEmailOTP(EmailId: string) {
        return this.httpClient.post<string>(environment.baseUrl + `Account/SendEmailOTP?EmailId=` + EmailId, EmailId,
        ).pipe(map(flag => {
            if (flag && flag == 'Success')
                return true;

            else
                return false;
        })
        );
    }

    ForgotPassword(EmailId: string, OTP: string): Observable<boolean> {
        return this.httpClient.post<string>(environment.baseUrl + `Account/ForgotPassword?EmailId=` + EmailId + '&OTP=' + OTP, { EmailId, OTP })
            .pipe(map(flag => {
                if (flag && flag == 'Success')
                    return true;
                else
                    return false;
            }));
    }


    GetIpAddressandBrowserInfo() {
        let browserInfo = '';
        let deviceInfo = null;
        deviceInfo = this.deviceService.getDeviceInfo();
        browserInfo = "browser:" + deviceInfo.browser + "|" + "browser_version:" + deviceInfo.browser_version + "|" +
            "device:" + deviceInfo.device + "|" + "os:" + deviceInfo.os + "|" +
            "os_version:" + deviceInfo.os_version + "|" + "userAgent:" + deviceInfo.userAgent + "|" +
            "isMobile:" + this.deviceService.isMobile() + "|" + "isTablet:" + this.deviceService.isTablet() + "|" +
            "isDesktopDevice:" + this.deviceService.isDesktop();
        return browserInfo;
    }

    //#region "Company Register"

    ExistCompanyName(CompanyName: string) {
        return this.httpClient.get<string>(environment.baseUrl + `Account/ExistCompanyName?CompanyName=` + CompanyName)
            .pipe(map(users => {
                if (users && users == 'Success')
                    return true;
                else
                    return false;
            })
            );
    }

    ExistCompanyEmail(Email: string) {
        return this.httpClient.get<string>(environment.baseUrl + `Account/ExistCompanyEmail?Email=` + Email)
            .pipe(map(users => {
                if (users && users == 'Success')
                    return true;
                else
                    return false;
            })
            );
    }

    ExistCompanyPrimaryGST(PrimaryGST: string) {
        return this.httpClient.get<string>(environment.baseUrl + `Account/ExistCompanyPrimaryGST?PrimaryGST=` + PrimaryGST)
            .pipe(map(users => {
                if (users && users == 'Success')
                    return true;
                else
                    return false;
            })
            );
    }

    ExistCompanySecondaryGST(SecondaryGST: string) {
        return this.httpClient.get<string>(environment.baseUrl + `Account/ExistCompanySecondaryGST?SecondaryGST=` + SecondaryGST)
            .pipe(map(users => {
                if (users && users == 'Success')
                    return true;
                else
                    return false;
            })
            );
    }

    public RegisterCompany(Filedata: File, companyRegister: CompanyRegister): Observable<Result> {
        // let frmData = new FormData();
        // frmData.append("CompanyLogoPath", Filedata, Filedata.name);
        return this.httpClient.post<Result>(environment.baseUrl + `Account/RegisterCompany`, companyRegister)
            .pipe(catchError(this.handleError));

    }

    //#endregion "Company Register"

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}