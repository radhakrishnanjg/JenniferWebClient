import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { StatementService } from '../../_services/service/statement.service';
import { SellerstatementService } from '../../_services/service/sellerstatement.service';
import { Statement, Ticket, History, SurveyMaster } from '../../_services/model';
import { saveAs } from 'file-saver';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
import { TicketService } from 'src/app/_services/service/ticket.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-statementview',
  templateUrl: './statementview.component.html',
  styleUrls: ['./statementview.component.css']
})
export class StatementviewComponent implements OnInit {

  obj: Statement;
  objTicket: Ticket = {} as any;
  identity: string = '';
  dtOptions: DataTables.Settings = {};
  action: boolean = false;
  customerMsg: string = '';
  userType: string; 
  investmentTotal: number = 0.00;
  constructor(
    public _statementService: StatementService,
    private fb: FormBuilder,
    private _sellerStatementService: SellerstatementService,
    private _ticketService: TicketService,
    public _alertService: ToastrService,
    private _authorizationGuard: AuthorizationGuard,
    private _router: Router,
    private alertService: ToastrService,

    private aroute: ActivatedRoute) { }

  AgreeForm: FormGroup;
  SellerQueryForm: FormGroup;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.action = false;
      this.identity = params.get('id');
      if (this.identity != '') {
        this._sellerStatementService.SearchById(this.identity)
          .subscribe(
            (data: Statement) => {
              this.obj = data;
              this.investmentTotal = data.Stateopbalance + data.Investments;
            },
            (err: any) => {
              console.log(err);
            }
          );
      }
    });

    this.GetChatHistory();

    this.GetUserType();

    this.AgreeForm = this.fb.group({      
      // Query: ['', []],
    });
    this.SellerQueryForm = this.fb.group({      
      Query: ['', []],
    });
  }

  GetUserType() {
    this._ticketService.getUserType()
      .subscribe(
        (data) => {
          this.userType = data.UserType;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  // lstcustomerMsg: History[] = [] as any;
  // lstsupportMsg: History[] = [] as any;
  lstHistory: History[] = [] as any;
  GetChatHistory() {
    this._ticketService.searchSellerStatementChatHistory(this.identity)
      .subscribe(
        (data) => {
          if (data != null && data.length > 0) {
            // this.lstcustomerMsg = data.filter(a => a.UserType == 'C');
            // this.lstsupportMsg = data.filter(a => a.UserType == 'S');
            this.lstHistory = data;
            this.SupportQueryID = data[0].SupportQueryID;
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  onClickAgree(StatementNumber: string, Status: string) {
    if (this._authorizationGuard.CheckAcess("Statementlist", "ViewEdit")) {
      return;
    }
 
    this._sellerStatementService.UpdateStatus(StatementNumber, Status).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._router.navigate(['/Statementlist']);
          this.alertService.success(data.Msg);
        } else {
          this._router.navigate(['/Statementlist']);
          this.alertService.error(data.Msg);
        }
        $('#modalstatusconfimation').modal('hide'); 
      },
      (error: any) => {
        //
        console.log(error);
      }
    ); 
  }

  SupportQueryID: number = 0;
  onClickNeedMoreHelp() {
    this.action = true;
    this.customerMsg = '';
  }

  onClickGoBack() {
    this.action = false;
  }

  onClickSellerQuery() {
    this.objTicket.Query = this.customerMsg;
    this.objTicket.ModuleType = 'SELLER STATEMENTS';
    this.objTicket.Subject = 'Regarding Seller Statement';
    this.objTicket.ReferenceNumber = this.identity;
    this.objTicket.SupportQueryID = this.SupportQueryID;

    if (this.customerMsg.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter a message.!');
      return;
    }
    if (this.customerMsg.length > 8000) {
      this.alertService.error('This field should not exceed 8000 characters.!');
      return;
    }
    else {
      this._ticketService.insert(this.objTicket).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.alertService.success(data.Msg);
          } else {
            this.alertService.error(data.Msg);
          }
          this._router.navigate(['/Statementlist']);
          $('#modalstatusconfimation').modal('hide');
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  onClickBackButton() {
    // this._router.navigate(['/PaymentSurvey']);
    this.GetSurveys();
  }

  lstSurveyMaster: SurveyMaster[] = [] as any;
  GetSurveys() {
    this._ticketService.pendingSurvey()
      .subscribe(
        (data) => {
          if (data != null && data.length > 0) {
            this.lstSurveyMaster = data;
            this._router.navigate(['/' + this.lstSurveyMaster[0].AngularRoute]);
          }
          else {
            this._router.navigate(['/Statementlist']);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
}
