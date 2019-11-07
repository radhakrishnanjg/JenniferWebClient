import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import form_template from './form_template';
import form_template_error from './form_template_error';
import form_template_errordescription from './form_template_errordescription';
@Component({
  selector: 'app-dynamicform',
  templateUrl: './dynamicform.component.html',
  styleUrls: ['./dynamicform.component.css']
})
export class DynamicformComponent implements OnInit {

  myFormGroup: FormGroup;
  formTemplate: any = form_template;
  form_template_error: any = form_template_error;
  form_template_errordescription: any = form_template_errordescription;
  formDesignType: string = 'Grid1';
  constructor() { }
  ngOnInit() {
    let group = {}
    form_template.forEach(input_template => {
      if (input_template.ControlType == 'TextBox' ||
        input_template.ControlType == 'Number' ||
        input_template.ControlType == 'CheckBox' ||
        input_template.ControlType == 'TextArea') {
        if (input_template.IsMandantory) {
          group[input_template.ControlId] = new FormControl('', [Validators.required]);
        }
        else {
          group[input_template.ControlId] = new FormControl('');
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

  getCheckboxlistSelected(ControlId: string, Value: string) {
    let SelectedValues = this.formTemplate.filter(a => a.ControlId == ControlId)[0].options.includes(Value) ? Value : '';
    this.myFormGroup.patchValue({
      PrimaryStateID: SelectedValues,
    });
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
