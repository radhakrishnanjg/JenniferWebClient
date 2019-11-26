import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { RTVAmazonCaseID, RTVUsers } from '../model';
import { AuthenticationService } from './authentication.service';
import {
  Department
} from '../model';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class PasPrivateutilityService {
  lstDepartment: Department[] = [] as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }
  public GetDepartments(): Observable<Department[]> {
    return this.httpClient.get<string>(environment.baseUrl + `PASPrivateUtility/GetDepartments`)
      .pipe(
        map(data => {
          this.lstDepartment = JSON.parse(data);
          return JSON.parse(data) as Department[];
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
