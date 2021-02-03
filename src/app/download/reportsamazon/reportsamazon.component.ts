import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { DownloadMaster, DownloadDetail, DownloadLog } from '../../_services/model';
import { DownloadService } from '../../_services/service/download.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import ReportDescription from '../../../assets/reportdescription';

@Component({
  selector: 'app-reportsamazon',
  templateUrl: './reportsamazon.component.html',
  styleUrls: ['./reportsamazon.component.css']
})
export class ReportsamazonComponent implements OnInit {

  lstDownloadMaster: DownloadMaster[];
  lstDownloadDetail: DownloadDetail[];
  lstDownloadLog: DownloadLog[];
  Download_Master_ID: number = 0;
  Column1: string = '';
  Column2: string = '';
  Column3: string = '';
  Column4: string = '';
  Column5: string = '';
  txtColumn1: string = '';
  txtColumn2: string = '';
  txtColumn3: string = '';
  txtColumn4: string = '';
  txtColumn5: string = '';

  lstReportDescription: any = ReportDescription;
  Description: string = '';
  constructor(
    private alertService: ToastrService,
    private _authorizationGuard: AuthorizationGuard,
    private _DownloadService: DownloadService,
  ) { }

  MenuId: number = 0;
  Report_Type: string = '';
  ngOnInit() {
    this.Download_Master_ID = 0;
    this.MenuId = 88;
    this.Report_Type = 'Amazon';
    //87|88|89|90|91|92;  
    // 'Reportsinventory',  87  Inventory
    // 'Reportsamazon'      88  Amazon 
    // 'Reportscompliance'  89  Compliance  
    // 'Reportsanalytics'   90  Analytics 
    // 'Reportsmis'         91  MIS
    // 'Reportsothers'      92  Others  
    this._DownloadService.getDownloadScreens(this.Report_Type)
      .subscribe(
        (data: DownloadMaster[]) => {
          this.lstDownloadMaster = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  objDownloadLog: DownloadLog = {} as any;
  Downloadexcel(buttonType): void {

    if (this._authorizationGuard.CheckAcess("Reportsamazon", "ViewEdit")) {
      return;
    }
    if (this.Download_Master_ID == 0) {
      this.alertService.error('Please select report name!');
      return;
    }
    if (this.lstDownloadDetail.length > 0) {
      let dyamicspstring = ' ';
      var SP_Name = this.lstDownloadDetail[0].SP_Name;
      var Screen_Name = this.lstDownloadDetail[0].Screen_Name;
      dyamicspstring += SP_Name;
      this.lstDownloadDetail.forEach((element) => {
        var P_Name = element.P_Name;
        var Column_Name = element.Column_Name;
        if (Column_Name == "Column1") {
          dyamicspstring += ' ' + P_Name + '="' + this.txtColumn1 + '",';
        }
        else if (Column_Name == "Column2") {
          dyamicspstring += ' ' + P_Name + '="' + this.txtColumn2 + '",';
        }
        else if (Column_Name == "Column3") {
          dyamicspstring += ' ' + P_Name + '="' + this.txtColumn3 + '",';
        }
        else if (Column_Name == "Column4") {
          dyamicspstring += ' ' + P_Name + '="' + this.txtColumn4 + '",';
        } else if (Column_Name == "Column5") {
          dyamicspstring += ' ' + P_Name + '="' + this.txtColumn5 + '",';
        }
      });
      let bflag: boolean = true;
      this.lstDownloadDetail.forEach((element) => {
        var Column_Name = element.Column_Name;
        if (Column_Name == "Column1" && element.IsMandatory == true && this.txtColumn1 == "") {
          this.alertService.error("Please enter " + this.Column1 + ".!");
          return bflag = false;
        }
        else if (Column_Name == "Column2" && element.IsMandatory == true && this.txtColumn2 == "") {
          this.alertService.error("Please enter " + this.Column2 + ".!");
          return bflag = false;
        }
        else if (Column_Name == "Column3" && element.IsMandatory == true && this.txtColumn3 == "") {
          this.alertService.error("Please enter " + this.Column3 + ".!");
          return bflag = false;
        }
        else if (Column_Name == "Column4" && element.IsMandatory == true && this.txtColumn4 == "") {
          this.alertService.error("Please enter " + this.Column4 + ".!");
          return bflag = false;
        }
        else if (Column_Name == "Column5" && element.IsMandatory == true && this.txtColumn5 == "") {
          this.alertService.error("Please enter " + this.Column5 + ".!");
          return bflag = false;
        }
      });
      if (buttonType == "Download") {
        if (bflag || this.lstDownloadDetail.length == 0) {
          // this._DownloadService.downloadExcel(SP_Name, this.MenuId, Screen_Name, dyamicspstring)
          //   .subscribe(data => {
          //     if (data != null && data.Flag == true) {
          //       this._DownloadService.Download(Screen_Name, this.MenuId)
          //         .subscribe(data1 => {
          //           saveAs(data1, Screen_Name + '.xls');//+ '.xls'
          //           this.alertService.success("File downloaded succesfully.!");
          //         },
          //           (err) => {
          //             console.log(err);
          //           }
          //         );
          //     } else {
          //       this.alertService.error(data.Msg);
          //     }
          //   },
          //     (err) => {
          //       console.log(err);
          //     }
          //   );

          this._DownloadService.DownloadExcelJSON(SP_Name, this.MenuId, Screen_Name, dyamicspstring).subscribe(
            (data: any[]) => {
              if (data.length > 0) {
                this._DownloadService.exportAsExcelFile(data, Screen_Name);
              }
              else {
                this.alertService.error('No Records Found!');
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
      }
      else if (buttonType == "Request") {
        if (bflag || this.lstDownloadDetail.length == 0) {
          this.objDownloadLog = new DownloadLog();
          this.objDownloadLog.MenuId = this.MenuId;
          this.objDownloadLog.Download_Master_ID = this.Download_Master_ID;
          this.objDownloadLog.Dynamic_Query = dyamicspstring;
          this.objDownloadLog.Report_Type = this.Report_Type;
          // this._DownloadService.InsertDownloadLog(this.objDownloadLog)
          //   .subscribe(data => {
          //     if (data != null && data.Flag == true) {
          //       this.alertService.success(data.Msg);
          //       this.GetDownloadLog(this.Download_Master_ID);
          //     } else {
          //       this.alertService.error(data.Msg);
          //     }
          //   },
          //     (err) => {
          //       console.log(err);
          //     }
          //   );

          this._DownloadService.InsertDownloadLogJSON(this.objDownloadLog)
            .subscribe(data => {
              if (data != null && data.Flag == true) {
                this.alertService.success(data.Msg);
                this.GetDownloadLog(this.Download_Master_ID);
              } else {
                this.alertService.error(data.Msg);
              }
            },
              (err) => {
                console.log(err);
              }
            );
        }
      }
    }

  }

  Refresh(): void {
    this.Download_Master_ID = 0;
    $(".dvhide").hide();
  }
  IsManualRequest: boolean;
  onScreenNameChange(Download_Master_ID: string) {
    let id = parseInt(Download_Master_ID);
    if (id > 0) {
      this.GetDownloadLog(id);
      this._DownloadService.getDownloadParameters(id)
        .subscribe(
          (data: DownloadDetail[]) => {
            this.lstDownloadDetail = data;
            this.Description = this.lstDownloadDetail[0].ReportDecription;
            this.IsManualRequest = this.lstDownloadDetail[0].IsManualRequest;
            if (data != null && this.lstDownloadDetail.length > 0) {
              $(".dvhide").hide();
              this.lstDownloadDetail.forEach((element) => {
                var Text_Type = element.Text_Type;
                var Download_Detail_ID = element.Download_Detail_ID;
                if (Text_Type == "TEXT") {
                  $("#txtColumn" + Download_Detail_ID).attr("type", "text");
                }
                else if (Text_Type == "DATE") {
                  $("#txtColumn" + Download_Detail_ID).attr("type", "date");
                }
                else if (Text_Type == "NUMBER") {
                  $("#txtColumn" + Download_Detail_ID).attr("type", "number");
                  $("#txtColumn" + Download_Detail_ID).attr("min", "1");
                  $("#txtColumn" + Download_Detail_ID).attr("max", "10000000");
                }
                else if (Text_Type == "DAY") {
                  $("#txtColumn" + Download_Detail_ID).attr("type", "number");
                  $("#txtColumn" + Download_Detail_ID).attr("min", "1");
                  $("#txtColumn" + Download_Detail_ID).attr("max", "31");
                }
                else if (Text_Type == "MONTH") {
                  $("#txtColumn" + Download_Detail_ID).attr("type", "number");
                  $("#txtColumn" + Download_Detail_ID).attr("min", "1");
                  $("#txtColumn" + Download_Detail_ID).attr("max", "12");
                }
                else if (Text_Type == "YEAR") {
                  $("#txtColumn" + Download_Detail_ID).attr("type", "number");
                  $("#txtColumn" + Download_Detail_ID).attr("min", "2015");
                  $("#txtColumn" + Download_Detail_ID).attr("max", "2025");
                }
                if (this.lstDownloadDetail.length == 1) {
                  this.Column1 = this.lstDownloadDetail[0].Display_Name;
                }
                if (this.lstDownloadDetail.length == 2) {
                  this.Column1 = this.lstDownloadDetail[0].Display_Name;
                  this.Column2 = this.lstDownloadDetail[1].Display_Name;
                }
                if (this.lstDownloadDetail.length == 3) {
                  this.Column1 = this.lstDownloadDetail[0].Display_Name;
                  this.Column2 = this.lstDownloadDetail[1].Display_Name;
                  this.Column3 = this.lstDownloadDetail[2].Display_Name;
                }
                if (this.lstDownloadDetail.length == 4) {
                  this.Column1 = this.lstDownloadDetail[0].Display_Name;
                  this.Column2 = this.lstDownloadDetail[1].Display_Name;
                  this.Column3 = this.lstDownloadDetail[2].Display_Name;
                  this.Column4 = this.lstDownloadDetail[3].Display_Name;
                }
                if (this.lstDownloadDetail.length == 5) {
                  this.Column1 = this.lstDownloadDetail[0].Display_Name;
                  this.Column2 = this.lstDownloadDetail[1].Display_Name;
                  this.Column3 = this.lstDownloadDetail[2].Display_Name;
                  this.Column4 = this.lstDownloadDetail[3].Display_Name;
                  this.Column5 = this.lstDownloadDetail[4].Display_Name;
                }
                $("#dv" + Download_Detail_ID).show();
              });
            }
            else {
              $(".dvhide").hide();
            }
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }
  GetDownloadLog(Download_Master_ID: number): void {
    this._DownloadService.getDownloadLog(Download_Master_ID)
      .subscribe(data => {
        this.lstDownloadLog = data;
      },
        (err) => {
          console.log(err);
        }
      );
  }
  DownloadFile(ReportID: string, MenuId: number): void {
    // this._DownloadService.Download(ReportID, MenuId)
    //   .subscribe(data1 => {
    //     saveAs(data1, ReportID + '.xls');//+ '.xls'
    //     this.alertService.success("File downloaded succesfully.!");
    //   },
    //     (err) => {
    //       console.log(err);
    //     }
    //   ); 
    this._DownloadService.DownloadJson(ReportID).subscribe(
      (data: any[]) => {
        if (data.length > 0) {
          this._DownloadService.exportAsExcelFile(data, ReportID);
        }
        else {
          this.alertService.error('No Records Found!');
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


}