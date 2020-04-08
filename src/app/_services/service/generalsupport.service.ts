import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Generalsupport, Result, JsonModal } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralsupportService {

  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public Insert(obj: Generalsupport): Observable<Result> { 
    let currentUser = this.authenticationService.currentUserValue;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `GeneralSupport/Insert`, this.objJsonModal)
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
