import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { Country, State } from '../../_services/model';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })

export class UtilityService {
  countries: Country[];
  states: State[];
  constructor(private httpClient: HttpClient) {
  }

  public getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(environment.baseUrl + 'Utility/GetCountries')
      .pipe(catchError(this.handleError));
  }

  public getStates(CountryId: number): Observable<State[]> {
    if (CountryId != 0) {
      return this.httpClient.get<State[]>(environment.baseUrl + `Utility/GetStates?CountryId=` + CountryId)
        .pipe(catchError(this.handleError));
    }
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}