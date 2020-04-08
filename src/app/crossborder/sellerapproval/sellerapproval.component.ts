import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SellerregistrationService } from '../../_services/service/crossborder/sellerregistration.service';
import { SellerRegistration } from '../../_services/model/crossborder';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
@Component({
  selector: 'app-sellerapproval',
  templateUrl: './sellerapproval.component.html',
  styleUrls: ['./sellerapproval.component.css']
})
export class SellerapprovalComponent implements OnInit {
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
}





