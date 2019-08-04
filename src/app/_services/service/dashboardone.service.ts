import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';  
import {  IDashboardBulletValues } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardoneService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getDashboard_BulletValues(FromDate: string, ToDate: string)
    : Observable<IDashboardBulletValues> {

    return this.httpClient.get<IDashboardBulletValues>(environment.baseUrl + `Dashboard1/Dashboard_BulletValues?FromDate=` + FromDate + '&ToDate=' + ToDate)
      .pipe(catchError(this.handleError));
  }
  
  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}
