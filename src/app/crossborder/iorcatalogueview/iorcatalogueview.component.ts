import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { CatalogueHeader, } from '../../_services/model/crossborder/index';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';

@Component({
  selector: 'app-iorcatalogueview',
  templateUrl: './iorcatalogueview.component.html',
  styleUrls: ['./iorcatalogueview.component.css']
})
export class IORCatalogueviewComponent implements OnInit {
  objHeader: CatalogueHeader = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;

  constructor(
    private alertService: ToastrService,
    private aroute: ActivatedRoute,
    private _catalogueService: CatalogueService,
    private _masteruploadService: MasteruploadService,
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._catalogueService.IORSearchById(this.identity)
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
    }
  }

}
