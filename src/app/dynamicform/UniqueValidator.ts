import { Injectable } from '@angular/core';

import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from '../_services/service/account.service';
@Injectable({ providedIn: 'root' })
export class UniqueValidator {

  debouncer: any;

  constructor(
    private _accountService: AccountService,
  ) {
  }


  checkUsername(FormID: string, ControlId: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._accountService.isEmailRegisterd(encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'UniqueError': true };
            }
          })
        );
    };
  }

}