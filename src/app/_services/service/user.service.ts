import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { IUser, IChangepassword, CompanyRegister, Userpermission, Dropdown ,Result} from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })

export class UserService {
    users: IUser[];
    companies: CompanyRegister[];
    company: CompanyRegister = {} as any;
    userpermissions: Userpermission[];
    objUser: IUser = {} as any;
    objuserpermission: Userpermission = {} as any;

    constructor(private httpClient: HttpClient,
        private authenticationService: AuthenticationService
    ) {

    }

    public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<IUser[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyId = currentUser.CompanyID;
        return this.httpClient.get<IUser[]>(environment.baseUrl + `User/Search?SearchBy=` + encodeURIComponent(SearchBy) +
            `&Search=` + Search + `&IsActive=` + IsActive + `&CompanyId=` + CompanyId)
            .pipe(catchError(this.handleError));
    }

    public getUser(Id: number): Observable<IUser> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyId = currentUser.CompanyID;
        return this.httpClient.get<IUser>(environment.baseUrl + `User/GetUser?Id=` + Id + `&CompanyId=` + CompanyId)
            .pipe(catchError(this.handleError));
    }

    public isEmailRegisterd(UserId: number, username: string) {
        UserId = isNaN(UserId) ? 0 : UserId;
        return this.httpClient.get<Boolean>(environment.baseUrl + `User/Exist?Email=` + username + `&UserId=` + UserId)
            .pipe(map(users => {
                if (users)
                    return true;
                else
                    return false;
            })
            );
    }

    public getFullName(Email: string): Observable<IUser> {
        return this.httpClient.get<IUser>(environment.baseUrl + `User/GetFullName?Email=` +  encodeURIComponent(Email))
            .pipe(catchError(this.handleError));
    }

    public add(user: IUser): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        user.CompanyID = currentUser.CompanyID;
        user.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `User/Create`, user)
            .pipe(catchError(this.handleError));
    }

    public update(user: IUser): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        user.CompanyID = currentUser.CompanyID;
        user.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `User/Update`, user)
            .pipe(catchError(this.handleError));
    }
    public delete(Id: number): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        this.objUser.UserId = Id;
        this.objUser.CompanyID = currentUser.CompanyID;
        this.objUser.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `User/Delete`, this.objUser)
            .pipe(catchError(this.handleError));
    }

    public changePassword(cgpwd: IChangepassword): Observable<boolean> {
        let currentUser = this.authenticationService.currentUserValue;
        cgpwd.UserId = currentUser.UserId;
        cgpwd.Email = currentUser.Email;
        return this.httpClient.post<boolean>(environment.baseUrl + `User/ChangePassword`, cgpwd)
            .pipe(catchError(this.handleError));
    }

    public profileUpdate(user: IUser): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue; 
        user.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `User/ProfileUpdate`, user)
            .pipe(catchError(this.handleError));
    }

    public updateImage(user: IUser): Observable<Result> { 
        let frmData = new FormData();
        frmData.append("FirstName", user.FirstName);
        frmData.append("LastName", user.LastName); 
        frmData.append("IsMailRequired", user.IsMailRequired? "True":"False");
        frmData.append("LoginId", user.UserId.toString());
        frmData.append("ImageData", user.Filedata, user.Filedata.name);
        return this.httpClient.post<Result>(environment.baseUrl + `User/UpdateImage`, frmData)
          .pipe(catchError(this.handleError));
      }

    //#region Company Register

    public companySearch(Search: string): Observable<CompanyRegister[]> {
        return this.httpClient.get<CompanyRegister[]>(environment.baseUrl + `User/CompanySearch?Search=` +encodeURIComponent(Search)   )
            .pipe(catchError(this.handleError));
    }

    public companySearchById(CompanyID: number): Observable<CompanyRegister> {
        return this.httpClient.get<CompanyRegister>(environment.baseUrl + `User/CompanySearchById?CompanyID=` + CompanyID)
            .pipe(catchError(this.handleError));
    }
    public CompanyAuthorise(CompanyID: number): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        this.company.CompanyID = CompanyID;
        this.company.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `User/CompanyAuthorise`, this.company)
            .pipe(catchError(this.handleError));
    }
    public companyDelete(CompanyID: number): Observable<Boolean> {
        let currentUser = this.authenticationService.currentUserValue;
        this.company.CompanyID = CompanyID;
        this.company.LoginId = currentUser.UserId;
        let LoginId = currentUser.UserId;
        return this.httpClient.post<Boolean>(environment.baseUrl + `User/CompanyDelete`, this.company)
            .pipe(catchError(this.handleError));
    }



    //#endregion

    //#region User Permission

    public getUserPermission(UserId: number): Observable<Userpermission[]> {
        return this.httpClient.get<Userpermission[]>(environment.baseUrl + `User/GetUserPermission?UserId=` + UserId)
            .pipe(catchError(this.handleError));
    }

    public updateUserPermission(userpermissions: Userpermission[]): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginId = currentUser.UserId;
        userpermissions.map(a => a.LoginId = LoginId);
        return this.httpClient.post<Result>(environment.baseUrl + `User/UpdateUserPermission`, userpermissions)
            .pipe(catchError(this.handleError));
    }


    //#endregion

    //#region Menu
    public getMenus(): Observable<Userpermission[]> {
        return this.httpClient.get<Userpermission[]>(environment.baseUrl + `User/GetMenus`)
            .pipe(catchError(this.handleError));
    }

    public updateMenu(MenuID: number, IsActive: Boolean): Observable<Boolean> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginId = currentUser.UserId;
        this.objuserpermission.LoginId = currentUser.UserId;
        this.objuserpermission.MenuID = MenuID;
        this.objuserpermission.IsActive = IsActive;
        return this.httpClient.post<Boolean>(environment.baseUrl + `User/UpdateMenu`, this.objuserpermission)
            .pipe(catchError(this.handleError));
    }
    //#endregion

    //#region  Master Screen 

    public getUserMasterUploadScreens(): Observable<Dropdown[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let UserId = currentUser.UserId;
        return this.httpClient.get<Dropdown[]>(environment.baseUrl + `User/GetUserMasterUploadScreens?UserId=` + UserId)
            .pipe(catchError(this.handleError));
    }

    public getUserMasterUploadScreensEdit(UserId: number): Observable<Dropdown[]> {
        return this.httpClient.get<Dropdown[]>(environment.baseUrl + `User/GetUserMasterUploadScreensEdit?UserId=` + UserId)
            .pipe(catchError(this.handleError));
    }


    //#endregion



    // private handleError(errorResponse: HttpErrorResponse) {
    //     if (errorResponse.error instanceof ErrorEvent) {
    //         console.error('Client Side Error :', errorResponse.error.message);
    //     } else {
    //         console.error('Server Side Error :', errorResponse);
    //     }
    //     return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    // }

    private handleError(error: HttpErrorResponse) {

        if (error.status === 404)
            return throwError(new NotFoundError(error));

        if (error.status === 400)
            return throwError(new BadRequest(error));
        return throwError(new AppError(error));
    }
}