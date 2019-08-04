import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Contact, Emailtemplate, Result } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  lstContact: Contact[];
  objContact: Contact = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Contact[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Contact[]>(environment.baseUrl +
      `Contact/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchByType(ContactType: string): Observable<Contact[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Contact[]>(environment.baseUrl +
      `Contact/SearchByType?CompanyID=` + CompanyID + `&ContactType=` + ContactType)
      .pipe(catchError(this.handleError));
  }

  public searchById(ContactID: number): Observable<Contact> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Contact>(environment.baseUrl +
      `Contact/SearchByID?CompanyID=` + CompanyID + `&ContactID=` + ContactID)
      .pipe(catchError(this.handleError));
  }

  public exist(ContactID: number, Email: string) {
    ContactID = isNaN(ContactID) ? 0 : ContactID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Contact/Exist?CompanyID=` + CompanyID + `&Email=` + Email + `&ContactID=` + ContactID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public existMobile(ContactID: number, MobileNumber: string) {
    ContactID = isNaN(ContactID) ? 0 : ContactID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `Contact/ExistMobile?ContactID=` + ContactID + `&MobileNumber=` + MobileNumber + `&CompanyID=` + CompanyID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public add(objContact: Contact): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objContact.CompanyId = currentUser.CompanyID;
    objContact.CompanyDetailID = currentUser.CompanyDetailID;
    objContact.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Contact/Create`, objContact)
      .pipe(catchError(this.handleError));
  }

  public update(objContact: Contact): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objContact.CompanyId = currentUser.CompanyID;
    objContact.CompanyDetailID = currentUser.CompanyDetailID;
    objContact.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Contact/Update`, objContact)
      .pipe(catchError(this.handleError));
  }
  public delete(ContactID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objContact.ContactID = ContactID;
    this.objContact.CompanyId = currentUser.CompanyID;
    this.objContact.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Contact/Delete`, this.objContact)
      .pipe(catchError(this.handleError));
  }

  public searchByTemplateID(EmailTemplateID: number): Observable<Contact[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Contact[]>(environment.baseUrl +
      `Contact/SearchByTemplateID?CompanyID=` + CompanyID + `&EmailTemplateID=` + EmailTemplateID)
      .pipe(catchError(this.handleError));
  }

  public emailTemplateUpsert(objEmailtemplate: Emailtemplate, contactids: number[]): Observable<Result> {
    this.lstContact = [] as any;
    contactids.forEach(element => {
      let Contact1: Contact = {} as any;
      Contact1.ContactID = element;
      this.lstContact.push(Contact1);
    });
    objEmailtemplate.lstContact = this.lstContact;
    let currentUser = this.authenticationService.currentUserValue;
    objEmailtemplate.CompanyId = currentUser.CompanyID;
    objEmailtemplate.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Contact/EmailTemplateUpsert`,
      objEmailtemplate)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
