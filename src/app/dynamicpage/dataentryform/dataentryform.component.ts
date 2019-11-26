import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { TrimPipe } from 'ngx-pipes';
//SERVICES
import { DynamicformService } from '../../_services/service/dynamicform.service';
import { UniqueValidator } from '../../_validators/UniqueValidator';
//MODAL IMPORT
import {
  DynamicFormViewModel, DynamicFormDropDownViewModel,
  DynamicFormColumnViewModel
} from '../../_services/model';
@Component({
  selector: 'app-dataentryform',
  templateUrl: './dataentryform.component.html',
  styleUrls: ['./dataentryform.component.css']
})
export class DataentryformComponent implements OnInit {

  myFormGroup: FormGroup;
  formTemplate: DynamicFormColumnViewModel[] = [] as any;
  form_template_error: any = {} as any;
  form_template_data: any = {} as any;
  objDynamicFormViewModel: DynamicFormViewModel = {} as any;
  lstDynamicFormDropDownViewModel: DynamicFormDropDownViewModel[] = [] as any;
  RequestFormID: number = 0;
  FormName: string = '';
  FormType: string = '';
  FormID: string = '';
  Action: string = 'Create';
  FormDesignType: string = 'Grid1';
  ActionStatus: string = '';
  ActionRemarks: string = '';
  constructor(
    private _alertService: ToastrService,
    private _dynamicformService: DynamicformService,
    private _aroute: ActivatedRoute,
    private _uniqueValidator: UniqueValidator,
    private _trimPipe: TrimPipe
  ) { }

  ngOnInit() {
    this._aroute.paramMap.subscribe(params => {
      this.RequestFormID = +params.get('id');
      this.FormID = params.get('FormId');

      if (this.FormID == 'NA') {
        this.Action = 'Create';
        let group = {}
        this.myFormGroup = new FormGroup(group);
        this.GenerateFormID();
        this.loadFormHeaderOnly();
      }
      else {
        this.Action = 'View';
        this.loadFormHeaderOnly();
        this.loadFormColumns_View();
        this.loadFormData();
      }
    });
  }

  public restrictNumeric(e, controlid: string) {
    let input;
    let AllowedChars = this.formTemplate.filter(a => a.ControlId == controlid)[0].AllowedChars;
    //AllowedChars = "[a-z]";
    input = String.fromCharCode(e.which);
    //return /[a-z]/i.test(event.key)"
    return !!/[/'+AllowedChars +']/i.test(input);
  }

  //#region View 
  loadFormHeaderOnly() {
    this._dynamicformService.GetFormHeader(this.RequestFormID)
      .subscribe(
        (data: string) => {
          this.FormType = JSON.parse(data)[0].FormType;
          this.FormName = JSON.parse(data)[0].FormName;
          this.FormDesignType = JSON.parse(data)[0].FormDesignType;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  loadFormData() {
    this._dynamicformService.GetData(this.RequestFormID, this.FormID)
      .subscribe(
        (data: string) => {

          this.form_template_data = JSON.parse(data);
          this.FormID = JSON.parse(data)["FormID"];
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  loadFormColumns_View() {
    this._dynamicformService.GetColumnDetail(this.RequestFormID)
      .subscribe(
        (data: string) => {
          this.formTemplate = JSON.parse(data);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  //#endregion

  //#region Create
  GenerateFormID() {
    this._dynamicformService.GenerateFormID(this.RequestFormID)
      .subscribe(
        (data: string) => {
          this.FormID = data;
          this.loadFormColumns();
          this.loadFormColumnErrors();
        },
        (err: any) => {
          console.log(err);
        }
      );
  }


  loadFormColumns() {
    this._dynamicformService.GetColumnDetail(this.RequestFormID)
      .subscribe(
        (data: string) => {
          this.formTemplate = JSON.parse(data);
          this.loadFormColumnDropDowns();
          let group = {}
          this.formTemplate.forEach(input_template => {
            //unique constraint needs to implement here for that textbox
            if (input_template.ControlType == 'TextBox') {
              debugger
              if (input_template.TypeName == 'Email Format') {
                group[input_template.ControlId] = new FormControl('', [Validators.required, Validators.email],
                  this._uniqueValidator.DynamicFormExist(this.RequestFormID, this.FormID, input_template.ControlId)
                );
                if (input_template.IsMandantory && input_template.IsUnique) {
                  group[input_template.ControlId] = new FormControl('', [Validators.required, Validators.email],
                    this._uniqueValidator.DynamicFormExist(this.RequestFormID, this.FormID, input_template.ControlId)
                  );
                }
                else if (input_template.IsMandantory == false && input_template.IsUnique) {
                  group[input_template.ControlId] = new FormControl('', [Validators.email],
                    this._uniqueValidator.DynamicFormExist(this.RequestFormID, this.FormID, input_template.ControlId)
                  );
                }
                else if (input_template.IsMandantory && input_template.IsUnique == false) {
                  group[input_template.ControlId] = new FormControl('', [Validators.required, Validators.email],
                  );
                }
                else if (input_template.IsMandantory == false && input_template.IsUnique == false) {
                  group[input_template.ControlId] = new FormControl('', [Validators.email]);
                }
                else {
                  group[input_template.ControlId] = new FormControl('', [Validators.email]);
                }
              }
              else {
                if (input_template.IsMandantory && input_template.IsUnique) {
                  group[input_template.ControlId] = new FormControl('', [Validators.required],
                    this._uniqueValidator.DynamicFormExist(this.RequestFormID, this.FormID, input_template.ControlId)
                  );
                }
                else if (input_template.IsMandantory == false && input_template.IsUnique) {
                  group[input_template.ControlId] = new FormControl('', [],
                    this._uniqueValidator.DynamicFormExist(this.RequestFormID, this.FormID, input_template.ControlId)
                  );
                }
                else if (input_template.IsMandantory && input_template.IsUnique == false) {
                  group[input_template.ControlId] = new FormControl('', [Validators.required],
                  );
                }
                else if (input_template.IsMandantory == false && input_template.IsUnique == false) {
                  group[input_template.ControlId] = new FormControl('');
                }
                else {
                  group[input_template.ControlId] = new FormControl('');
                }
              }
            }
            else if (
              input_template.ControlType == 'Number' ||
              input_template.ControlType == 'TextArea') {
              if (input_template.IsMandantory) {
                group[input_template.ControlId] = new FormControl('', [Validators.required]);
              }
              else {
                group[input_template.ControlId] = new FormControl('');
              }
            }
            else if (
              input_template.ControlType == 'CheckBox') {
              if (input_template.IsMandantory) {
                group[input_template.ControlId] = new FormControl(false, [Validators.requiredTrue]);
              }
              else {
                group[input_template.ControlId] = new FormControl(false);
              }
            }
            else if (input_template.ControlType == 'DropDown') {
              if (input_template.DropDownType == 'Static') {
                if (input_template.IsMandantory) {
                  group[input_template.ControlId] = new FormControl('', [Validators.required]);
                }
                else {
                  group[input_template.ControlId] = new FormControl('');
                }
              }
              else if (input_template.DropDownType == 'Dynamic') {
                if (input_template.IsMandantory) {
                  group[input_template.ControlId] = new FormControl(0, [Validators.min(1)]);
                }
                else {
                  group[input_template.ControlId] = new FormControl('');
                }
              }
            }
          })
          this.myFormGroup = new FormGroup(group);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  loadFormColumnErrors() {
    this._dynamicformService.GetColumnDetailError(this.RequestFormID)
      .subscribe(
        (data: string) => {
          this.form_template_error = JSON.parse(data);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  loadFormColumnDropDowns() {
    this._dynamicformService.GetColumnDetailDropDownValues(this.RequestFormID)
      .subscribe(
        (data: DynamicFormDropDownViewModel[]) => {
          this.lstDynamicFormDropDownViewModel = data;
          this.lstDynamicFormDropDownViewModel.forEach(element => {
            this.formTemplate.filter(a => a.ControlId == element.ControlId)[0].Options =
              JSON.parse(element.Options);
          });
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  //#endregion

  ChangeDesign(value: string) {
    // Add active class to the current button (highlight it)
    var header = document.getElementById("myDIV");
    var btns = header.getElementsByClassName("gridtype");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }
    this.FormDesignType = value;
  }

  logValidationErrors(group: FormGroup = this.myFormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      // if (this.formTemplate.filter(a => a.ControlId == key)[0].ControlType == 'TextBox' ||
      //   this.formTemplate.filter(a => a.ControlId == key)[0].ControlType == 'TextArea') {
      //   this.myFormGroup.get(key).setValue(this.myFormGroup.get(key).value.trim());
      // }
      const abstractControl = group.get(key);
      this.form_template_error[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        let messages = this.formTemplate.filter(a => a.ControlId == key)[0].MandantoryErrorMessage;
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.form_template_error[key] += messages + ' ';
            //validating the unique values based on error
            if (this.formTemplate.filter(a => a.ControlId == key)[0].IsUnique) {
              this.form_template_error[key] = this.formTemplate.filter(a => a.ControlId == key)[0].UniqueErrorMessage;
            }
            if (this.formTemplate.filter(a => a.ControlId == key)[0].TypeName == 'Email Format') {
              this.form_template_error[key] = 'This field must be an email format';
            }
            if (this.formTemplate.filter(a => a.ControlId == key)[0].TypeName == 'Number Format') {
              this.form_template_error[key] = 'This field must be valid format';
            }
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  getErrorMessage(key: string) {
    return this.form_template_error[key];
  }

  // getCheckboxlistSelected(ControlId: string, Value: string) {
  //   let SelectedValues = this.formTemplate.filter(a => a.ControlId == ControlId)[0].options.includes(Value) ? Value : '';
  //   this.myFormGroup.patchValue({
  //     PrimaryStateID: SelectedValues,
  //   });
  // }

  onchangeDependent(ControlId: string, Id: number) {
    if (Id > 0) {
      let WhereClause = this.formTemplate.filter(a => a.ControlId == ControlId)[0].WhereClause;
      let Caption = this.formTemplate.filter(a => a.ControlId == ControlId)[0].Caption;
      this._dynamicformService.GetChildDropdownData(this.RequestFormID, WhereClause, Caption, Id.toString())
        .subscribe(
          (data: string) => {
            this.formTemplate.filter(a => a.ControlId == Caption)[0].Options =
              JSON.parse(data);
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
    else {
      this.formTemplate.filter(a => a.Caption == ControlId)[0].Options = JSON.parse("[]");
    }
  }

  getDataByCaption(Caption: string) {
    let a = this.form_template_data[Caption];
    return a;
  }
  add() {
    console.log('Added');
    this._alertService.info("data added successfully", 'Important!',
      {
        timeOut: 100000,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        closeButton: true,
        tapToDismiss: false
      });
  }

  onSubmit() {
    Object.keys(this.myFormGroup.controls).forEach((key) => {
      if (this.formTemplate.filter(a => a.ControlId == key)[0].ControlType == 'TextBox' ||
        this.formTemplate.filter(a => a.ControlId == key)[0].ControlType == 'TextArea') {
        this.myFormGroup.get(key).setValue(this.myFormGroup.get(key).value.trim());
      }
    });

    let resource = JSON.stringify(this.myFormGroup.value);
    console.log('Add Button clicked: ' + resource);
    this.objDynamicFormViewModel.RequestFormID = this.RequestFormID;
    this.objDynamicFormViewModel.FormID = this.FormID;
    this.objDynamicFormViewModel.Json = resource;
    this._dynamicformService.Insert(this.objDynamicFormViewModel)
      .subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.myFormGroup.reset();
            this.GenerateFormID();
            this.loadFormHeaderOnly();
            this._alertService.success(data.Msg);
            //this._router.navigate(['/Goodsinwardlist']);
          }
          else {
            //
            this._alertService.error(data.Msg);
            //this._router.navigate(['/Goodsinwardlist']);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }



}
