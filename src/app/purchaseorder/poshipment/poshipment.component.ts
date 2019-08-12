import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PoshipmentService } from '../../_services/service/poshipment.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'


import { UsernameValidator } from '../../_validators/username';
import { Apisettings, Poshipment, Poorder, Poorderitem, Location } from '../../_services/model';
import * as moment from 'moment';


@Component({
  selector: 'app-poshipment',
  templateUrl: './poshipment.component.html',
  styleUrls: ['./poshipment.component.css']
})
export class PoshipmentComponent implements OnInit {

  lstpendingshipments: Poorder[];
  lstpoorderitem: Poorderitem[];
  lstshipmentqty: Poorderitem[];
  lstlocation: Location[];
  poshipmentForm: FormGroup;
  uploaddata: Poshipment = {} as any;
  selectedFile: File[];
  MinDate: moment.Moment;
  identity: number = 0;
  POId: number = 0;
  PONumber: string = '';
  AttachedFileNames: string = '';
  panelTitle: string;
  action: boolean;
  ShipmentNumber: string = '';
  TotalPOQty: number = 0;
  TotalAvailableQty: number = 0;
  TotalShipmentQty: number = 0;
  ShipmentType: string = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public _poshipmentService: PoshipmentService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private usernameValidator: UsernameValidator,
    private aroute: ActivatedRoute,
  ) {
  }

  formErrors = {
    'POID': '',
    'ShipmentType': '',
    'ShipmentNumber': '',
    'ShipmentName': '',
    'CarpID': '',
    'Appointment': '',

    'Remarks': '',
    'FileData': '',
  };

  validationMessages = {
    'POID': {
      'min': 'This Field is required.',
    },
    'ShipmentType': {
      'required': 'This Field is required.',
    },
    'ShipmentNumber': {
      'required': 'This Field is required.',
      'ShipmentNumberInUse': 'This Field already used.',
    },
    'ShipmentName': {
      'required': 'This Field is required.',
    },
    'CarpID': {
      'required': 'This Field is required.',
    },
    'Appointment': {
      'required': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
      'minlength': 'This Field must be greater than 3 characters.',
    },
    'FileData': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.poshipmentForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/\s/g, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  ngOnInit() {
    this.MinDate = moment().add(0, 'days');

    this._spinner.show();
    this._poshipmentService.shipment_Pending()
      .subscribe(
        (data: Poorder[]) => {
          this.lstpendingshipments = data;
          this._spinner.hide();
        },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );

    this._spinner.show();
    this._privateutilityService.getLocations().subscribe(
      (data) => {
        this.lstlocation = data;
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.POId = +params.get('PoId');
      if (this.identity > 0) {
        this.panelTitle = "Edit Shipment";
        this.action = false;

        this._spinner.show();
        this._poshipmentService.searchById(this.POId, this.identity)
          .subscribe(
            (data: Poshipment) => {
              var Appointment = moment(data.Appointment, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
              this.poshipmentForm.patchValue({
                POID: data.POID,
                ShipmentNumber: data.ShipmentNumber,
                ShipmentName: data.ShipmentName,
                CarpID: data.CarpID,
                // Appointment: data.Appointment,
                Appointment: { startDate: new Date(Appointment) },
                AttachedFileNames: data.AttachedFileNames,
                FileData: data.AttachedFileNames,
                Remarks: data.Remarks,
                IsMailSent: data.IsMailSent,
                ShipmentType: 'Auto',
              });
              this.ShipmentNumber = data.ShipmentNumber;
              this.poshipmentForm.get('POID').disable();
              this.poshipmentForm.get('ShipmentNumber').disable();
              this.poshipmentForm.get('ShipmentName').disable();
              this.poshipmentForm.get('FileData').disable();
              this.lstshipmentqty = data.lstItem;
              this.TotalPOQty = this.lstshipmentqty.reduce((acc, a) => acc + a.POQty, 0);
              this.TotalAvailableQty = this.lstshipmentqty.reduce((acc, a) => acc + a.AvailableQty, 0);
              this.TotalShipmentQty = this.lstshipmentqty.reduce((acc, a) => acc + a.ShipmentQty, 0);

              this.PONumber = data.PONumber;
              this.AttachedFileNames = data.AttachedFileNames;
              //this.logValidationErrors();
              //this.AppointmentUpdated();
              this._spinner.hide();
              $('#Appointment').val(Appointment);
            },
            (err: any) => {
              console.log(err);
              this._spinner.hide();
            }
          );
        //this.logValidationErrors();
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Shipment";
      }
    });

    this.poshipmentForm = this.fb.group({
      POID: [0, [Validators.min(1)]],
      ShipmentNumber: ['', [Validators.required],
        //this.usernameValidator.existShipmentNumber(this.identity)
      ],
      ShipmentName: ['', [Validators.required]],
      CarpID: ['', [Validators.required]],
      Appointment: ['', [Validators.required]],

      Remarks: ['', [Validators.required, Validators.minLength(3)]],
      FileData: ['', [Validators.required]],
      IsMailSent: [0,],
      ShipmentType: ['', Validators.required],
    });

  }

  AppointmentUpdated(value) {
    this.logValidationErrors();
    // var Appointment = moment(value, 'DD-MM-YYYY HH:mm').format('MM-DD-YYYY HH:mm').toString();
    // $('#Appointment').val(Appointment); 
  }

  onLoad() {

  }
  onFileChanged(e: any) {
    this.selectedFile = e.target.files;
  }

  onchangePOID(selectedValue: number) {
    if (selectedValue != 0) {
      this._spinner.show();
      return this._poshipmentService.getShipmentAvailableQty(selectedValue).subscribe(
        (data) => {
          this.lstpoorderitem = data;
          this.TotalPOQty = this.lstpoorderitem.reduce((acc, a) => acc + a.POQty, 0);
          this.TotalAvailableQty = this.lstpoorderitem.reduce((acc, a) => acc + a.AvailableQty, 0);
          this.TotalShipmentQty = this.lstpoorderitem.reduce((acc, a) => acc + a.ShipmentQty, 0);
          this._spinner.hide();
        },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
    }
  }

  onchangeShipmentType(selectedValue: string) {
    if (selectedValue != "") {
      if (selectedValue == "Manual") {
        this.poshipmentForm.patchValue(
          {
            ShipmentNumber: '',
          });
        this.ShipmentType = selectedValue;
      }
      else {
        this.poshipmentForm.patchValue(
          {
            ShipmentNumber: 'Auto',
          });
        this.ShipmentType = selectedValue;
      }
    }

  }

  updateList(id: number, property: string, value: number) {
    const editField = parseInt(value.toString());
    const AvailableQty = parseInt(this.lstpoorderitem[id]['AvailableQty'].toString());
    if (editField < 0) {
      this._alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this._alertService.error('Entered Qty must be less than or equal to Available Qty.!');
      return;
    }
    else {
      this.lstpoorderitem[id][property] = editField;
      this.TotalPOQty = this.lstpoorderitem.reduce((acc, a) => acc + a.POQty, 0);
      this.TotalAvailableQty = this.lstpoorderitem.reduce((acc, a) => acc + a.AvailableQty, 0);
      this.TotalShipmentQty = this.lstpoorderitem.reduce((acc, a) => acc + a.ShipmentQty, 0);
    }
  }

  uploadFiles() {

    if (this._authorizationGuard.CheckAcess("Poshipmentlist", "ViewEdit")) {
      return;
    }
    if (this.poshipmentForm.invalid) {
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.POId = +params.get('PoId');
    });
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }


  Insert() {
    for (let File of this.selectedFile) {
      var filesizeMB = Math.round(File.size / 1024 / 1024);
      var fileexte = File.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.PDFFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.PDFFiles_Ext, fileexte)) {
        this._alertService.error("File must be extension with " + Apisettings.PDFFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this._alertService.error("File size must be less than or equal to " + Apisettings.PDFFiles_Fileszie + " MB");
        return;
      }
    }
    if (this.lstpoorderitem.filter(a => a.ShipmentQty > 0).length == 0) {
      this._alertService.error("Required order items.!");
      return;
    }
    // else if (this.lstpoorderitem.filter(a => a.ShipmentQty <= 0).length >= 0) {
    //   this._alertService.error("Shipment Qty must be greater than to 0.!");
    //   return;
    // }
    else {
      this.uploaddata.POID = this.poshipmentForm.controls['POID'].value;
      this.uploaddata.ShipmentNumber = this.poshipmentForm.controls['ShipmentNumber'].value;
      this.uploaddata.ShipmentName = this.poshipmentForm.controls['ShipmentName'].value;
      this.uploaddata.CarpID = this.poshipmentForm.controls['CarpID'].value;
      this.uploaddata.Appointment = this.poshipmentForm.controls['Appointment'].value.startDate._d.toLocaleString();

      this.uploaddata.Remarks = this.poshipmentForm.controls['Remarks'].value;
      this.uploaddata.IsMailSent = this.poshipmentForm.controls['IsMailSent'].value;
      this.uploaddata.lstItem = this.lstpoorderitem.filter(a => a.ShipmentQty > 0);
      this._spinner.show();
      this._poshipmentService.add(this.uploaddata, this.selectedFile).subscribe(
        (data) => {
          if (data.Flag == true) {
            this._spinner.hide();
            this._alertService.success(data.Msg);
            this.router.navigate(['/Poshipmentlist']);
          }
          else {
            this._spinner.hide();
            this._alertService.error(data.Msg);
            this.router.navigate(['/Poshipmentlist']);
          }

        },
        (error: any) => {
          this._spinner.hide();
          this._alertService.error("Error!:Poshipment not uploaded.");
          this.router.navigate(['/Poshipmentlist']);
        }
      );
    }
  }

  Update() {
    this.uploaddata.ShipmentID = this.identity;
    this.uploaddata.POID = this.poshipmentForm.controls['POID'].value;
    this.uploaddata.ShipmentNumber = this.poshipmentForm.controls['ShipmentNumber'].value;
    this.uploaddata.ShipmentName = this.poshipmentForm.controls['ShipmentName'].value;
    this.uploaddata.CarpID = this.poshipmentForm.controls['CarpID'].value;
    this.uploaddata.IsMailSent = this.poshipmentForm.controls['IsMailSent'].value;
    if (this.poshipmentForm.controls['Appointment'].value.startDate._d != undefined) {
      this.uploaddata.AppointmentDate = this.poshipmentForm.controls['Appointment'].value.startDate._d.toLocaleString();
    } else {
      this.uploaddata.AppointmentDate = this.poshipmentForm.controls['Appointment'].value.startDate.toLocaleString();
    }
    this.uploaddata.Remarks = this.poshipmentForm.controls['Remarks'].value;
    this.uploaddata.IsMailSent = this.poshipmentForm.controls['IsMailSent'].value;

    this._spinner.show();
    this._poshipmentService.update(this.uploaddata).subscribe(
      (data) => {
        if (data != null && data == true) {
          this._spinner.hide();
          this._alertService.success(' Poshipment data has been updated successful');
          this.router.navigate(['/Poshipmentlist']);
        }
        else {
          this._spinner.hide();
          this._alertService.error('Poshipment detail not saved!');
          this.router.navigate(['/Poshipmentlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }




  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

}
