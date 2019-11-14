import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

// import { BadRequest } from './../../common/bad-request';
// import { NotFoundError } from './../../common/not-found-error';
// import { AppError } from './../../common/app-error';

// import { AuthenticationService } from './authentication.service';
// import { Contact, Emailtemplate, Result } from '../model/index';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicformutilityService {

  constructor() { }
}
