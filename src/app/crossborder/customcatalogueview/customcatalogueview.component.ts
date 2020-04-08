import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { CatalogueDetail, CatalogueHeader, Apisettings, CatalogueHistory }
  from '../../_services/model/crossborder/index';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';

@Component({
  selector: 'app-customcatalogueview',
  templateUrl: './customcatalogueview.component.html',
  styleUrls: ['./customcatalogueview.component.css']
})
export class CustomcatalogueviewComponent implements OnInit {

  objHeader: CatalogueHeader = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;

  constructor(
    private alertService: ToastrService,
    private aroute: ActivatedRoute,
    private _catalogueService: CatalogueService,
    private _authorizationGuard: AuthorizationGuard,
    private _masteruploadService: MasteruploadService,
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._catalogueService.CustomSearchById(this.identity)
          .subscribe(
            (data: CatalogueHeader) => {
              debugger
              this.objHeader = data;
            },
            (err: any) =>
              console.log(err)
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
    } else {
    }
  }

}
