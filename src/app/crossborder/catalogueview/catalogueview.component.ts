import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CatalogueHeader } from '../../_services/model/crossborder';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';

@Component({
  selector: 'app-catalogueview',
  templateUrl: './catalogueview.component.html',
  styleUrls: ['./catalogueview.component.css']
})
export class CatalogueviewComponent implements OnInit {
  objHeader: CatalogueHeader = {} as any;
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
        this._catalogueService.searchById(this.identity)
          .subscribe(
            (data: CatalogueHeader) => {
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
