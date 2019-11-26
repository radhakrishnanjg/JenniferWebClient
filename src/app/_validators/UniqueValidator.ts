import { Injectable } from '@angular/core';

import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { DynamicformService } from '../_services/service/dynamicform.service';
import { DepartmentService } from '../_services/service/department.service';
import { SeniormasterService } from '../_services/service/seniormaster.service';
@Injectable({ providedIn: 'root' })
export class UniqueValidator {

  debouncer: any;

  constructor(
    private _dynamicformService: DynamicformService,
    private _departmentService: DepartmentService,
    private _seniormasterService: SeniormasterService,
  ) {
  }


  DynamicFormExist(RequestFormID: number, FormID: string, Caption: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      //.replace(/^\s+|\s+$/gm, '')
      return this._dynamicformService.Exist(RequestFormID, FormID, encodeURIComponent(control.value), Caption)
        .pipe(
          map(res => {
            if (res) {
              return { 'UniqueError': true };
            }
          })
        );
    };
  }

  DepartmentCodeExist(DepartmentID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._departmentService.Exist(DepartmentID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'UniqueError': true };
            }
          })
        );
    };
  }

  SeniorMasterTableNameExist(SeniorMasterTableID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._seniormasterService.Exist(SeniorMasterTableID, encodeURIComponent(control.value))
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