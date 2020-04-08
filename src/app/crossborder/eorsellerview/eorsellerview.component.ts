import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SellerregistrationService } from '../../_services/service/crossborder/sellerregistration.service';
import { SellerRegistration } from '../../_services/model/crossborder';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
@Component({
  selector: 'app-eorsellerview',
  templateUrl: './eorsellerview.component.html',
  styleUrls: ['./eorsellerview.component.css']
})
export class EorsellerviewComponent implements OnInit {

  obj: SellerRegistration = {} as any;
  identity: number = 0;
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _sellerregistrationService: SellerregistrationService,
    private aroute: ActivatedRoute,
    private _masteruploadService: MasteruploadService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._sellerregistrationService.SearchById(this.identity).subscribe(
          (data: SellerRegistration) => {
            this.obj = data;
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
  }

  DownloadButtonClick(ObjectId: string) {
    if (ObjectId != "") {
      this._masteruploadService.DownloadObjectFile(ObjectId)
        .subscribe(data => {
          this.alertService.success("File downloaded succesfully.!");
          saveAs(data, ObjectId)
        },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  ApprovalRemarks: string = '';
  Authorize(status) {
    if (this._authorizationGuard.CheckAcess("EORSellerlist", "ViewEdit")) {
      return;
    }
    this.obj.SellerFormID = this.identity;
    this.obj.ApprovalStatus = status;
    this.obj.ApprovalRemarks = this.ApprovalRemarks;
    if (status == 'Rejected') {
      if (this.ApprovalRemarks == "") {
        this.alertService.error("Please enter the Remarks.!");
        return;
      }
    }
    this._sellerregistrationService.Authorize(this.identity, this.obj.Email, status,
      this.ApprovalRemarks).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.alertService.success(data.Msg);
          }
          else {
            this.alertService.error(data.Msg);
          }
          if (status == 'Rejected') {
            $('#modalsellerApproval').modal('hide');
          }
          this.router.navigate(['/CrossBorder/EORSellerlist']);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
}
