import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CatalogueHeader } from '../../_services/model/crossborder';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';

@Component({
  selector: 'app-eorcatalogueview',
  templateUrl: './eorcatalogueview.component.html',
  styleUrls: ['./eorcatalogueview.component.css']
})
export class EorcatalogueviewComponent implements OnInit {
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
        this._catalogueService.EORSearchById(this.identity)
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
