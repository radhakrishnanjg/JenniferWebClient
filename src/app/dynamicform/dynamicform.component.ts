import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import form_template from './form_template';
import form_templatedropdown from './form_templatedropdown';
import form_template_error from './form_template_error';
import form_template_data from './form_template_data';
import dropdownresult from './dropdownresult';
@Component({
  selector: 'app-dynamicform',
  templateUrl: './dynamicform.component.html',
  styleUrls: ['./dynamicform.component.css']
})
export class DynamicformComponent implements OnInit {

  myFormGroup: FormGroup;
  formTemplate: any = form_template;
  form_templatedropdown: any = form_templatedropdown;
  form_template_error: any = form_template_error;
  form_template_data: any = form_template_data;
  dropdownresult: any = dropdownresult;
  formDesignType: string = 'Grid1';
  constructor() { }
  ngOnInit() {
    let group = {}
    form_template.forEach(input_template => {
      //unique constraint needs to implement here for that textbox
      if (input_template.ControlType == 'TextBox') {
        if (input_template.IsMandantory) {
          group[input_template.ControlId] = new FormControl('', [Validators.required]);
        }
        else {
          group[input_template.ControlId] = new FormControl('');
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

  }

  ChangeDesign(value: string) {
    this.formDesignType = value;
  }

  logValidationErrors(group: FormGroup = this.myFormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      if (this.formTemplate.filter(a => a.ControlId == key)[0].IsMandantory == 1) {

        const abstractControl = group.get(key);
        this.form_template_error[key] = '';
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          //const messages = this.form_template_errordescription[key];
          // for (const errorKey in abstractControl.errors) {
          //   if (errorKey) {
          //     this.form_template_error[key] += messages[errorKey] + ' ';
          //   }
          // } 
          let messages = this.formTemplate.filter(a => a.ControlId == key)[0].MandantoryErrorMessage;
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.form_template_error[key] += messages + ' ';
            }
          }
        }
        if (abstractControl instanceof FormGroup) {
          this.logValidationErrors(abstractControl);
        }
      }
    });
  }
  getErrorMessage(key: string) {
    return this.form_template_error[key];
  }

  getDropDownOptions(ControlId: string) {
    return this.form_templatedropdown.filter(a => a.ControlId == ControlId)[0].Options;
  }

  getCheckboxlistSelected(ControlId: string, Value: string) {
    let SelectedValues = this.formTemplate.filter(a => a.ControlId == ControlId)[0].options.includes(Value) ? Value : '';
    this.myFormGroup.patchValue({
      PrimaryStateID: SelectedValues,
    });
  }
  onchangeDependent(ControlId: string, Id: number) {
    if (Id > 0) {
      // this code will change based on web api call
      this.formTemplate.filter(a => a.Caption == ControlId)[0].Options =
        this.form_templatedropdown.filter(a => a.ControlId == ControlId)[0].Options;
      //
      // this.utilityService.getStates(countrid)
      //   .subscribe(
      //     (data: State[]) => {
      //       this.states = data;
      //       //
      //     },
      //     (err: any) => {
      //       //
      //       console.log(err);
      //     }
      //   );
    } else {
      this.formTemplate.filter(a => a.Caption == ControlId)[0].Options = [];
    }
    console.log('Value:' + Id);
    console.log('ControlId:' + ControlId);
  }

  getDataByCaption(Caption: string) {
    let a = form_template_data[Caption];
    return a;
  }

  onSubmit() {
    let resource = JSON.stringify(this.myFormGroup.value);

    console.log('Add Button clicked: ' + resource);
    let resJSON = JSON.parse(resource);
    let aaaaaa = Array.of(resJSON);
    console.log('Array: ' + aaaaaa);

    console.log(this.myFormGroup.value);
  }

}
