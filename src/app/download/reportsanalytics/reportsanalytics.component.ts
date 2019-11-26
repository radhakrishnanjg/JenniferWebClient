import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { DownloadMaster, DownloadDetail,DownloadLog } from '../../_services/model';
import { DownloadService } from '../../_services/service/download.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import ReportDescription from '../../../assets/reportdescription';
@Component({
  selector: 'app-reportsanalytics',
  templateUrl: './reportsanalytics.component.html',
  styleUrls: ['./reportsanalytics.component.css']
})
export class ReportsanalyticsComponent implements OnInit {

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

  ngOnInit() {
    this.Download_Master_ID = 0;
    //
    this._DownloadService.getDownloadScreens('Analytics')
      .subscribe(
        (data: DownloadMaster[]) => {
          this.lstDownloadMaster = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
  }

  Downloadexcel(): void {

    if (this._authorizationGuard.CheckAcess("Reportsanalytics", "ViewEdit")) {
      return;
    }
    if (this.Download_Master_ID == 0) {
      this.alertService.error('Please select report name!');
      return;
    }
    if (this.lstDownloadDetail.length > 0) {
      // $(".dvhide").hide();
      // $("#txtColumn1").val('');
      // $("#txtColumn2").val('');
      // $("#txtColumn3").val('');
      // $("#txtColumn4").val('');
      // $("#txtColumn5").val('');
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
      //var newStr = dyamicspstring.substring(0, dyamicspstring.length - 1);
      // 87	-Inventory
      // 88	-Amazon
      // 89	-Compliance
      // 90	-Analytics
      // 91	-MIS
      // 92	-Others 
      const MenuId = 90; //87|88|89|90|91|92;  
      this._DownloadService.downloadExcel(SP_Name,MenuId, Screen_Name, dyamicspstring)
        .subscribe(data => {
          if (data != null) {
            this._DownloadService.Download(Screen_Name, MenuId)
              .subscribe(data1 => {
                //
                saveAs(data1, Screen_Name + '.xls');//+ '.xls'
                this.alertService.success("File downloaded succesfully.!");
              },
                (err) => {
                  //
                  console.log(err);
                }
              );
          } else {
            this.alertService.error(data.Msg);
          }
          //
        },
          (err) => {
            //
            console.log(err);
          }
        );

      //this.alertService.success('Your Dynamic Query:' + newStr);
    }
  }

  Refresh(): void {
    this.Download_Master_ID = 0;
    $(".dvhide").hide();
  }

  onScreenNameChange(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      //
      this._DownloadService.getDownloadParameters(id)
        .subscribe(
          (data: DownloadDetail[]) => {
            this.lstDownloadDetail = data;
             this.Description = this.lstDownloadDetail[0].ReportDecription;
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
            const MenuId = 90;
            this._DownloadService.getDownloadLog(MenuId)
              .subscribe(data => {
                this.lstDownloadLog = data;
              },
                (err) => {
                  console.log(err);
                }
              );
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }

}
