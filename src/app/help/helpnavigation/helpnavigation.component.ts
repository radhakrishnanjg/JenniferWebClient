import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';

import { ViewportScroller } from '@angular/common';
import { Helpmenu } from '../../_services/model/helpmenu';
import { HelpmenuService } from '../../_services/service/helpmenu.service';
import { TicketService } from '../../_services/service/ticket.service'
import { Dropdown, Ticket } from 'src/app/_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-helpnavigation',
  templateUrl: './helpnavigation.component.html',
  styleUrls: ['./helpnavigation.component.css']
})

export class HelpnavigationComponent implements OnInit {

  SupportQueryForm: FormGroup;
  objTicket: Ticket = {} as any;

  items: Helpmenu[] = [] as any;
  SearchKeyword: string = '';
  panelTitle: string;
  constructor(
    private _HelpmenuService: HelpmenuService,
    private _PrivateutilityService: PrivateutilityService,
    private fb: FormBuilder,
    private _router: Router,
    private _authorizationGuard: AuthorizationGuard,
    private _ticketService: TicketService,
    private alertService: ToastrService,
  ) { }

  formErrors = {

    'ModuleType': '',
    'Subject': '',
    'ReferenceNumber': '',
    'Query': '',

  };

  validationMessages = {

    'ModuleType': {
      'required': 'This field is required.',

    },
    'Subject': {
      'required': 'This field is required.',
    },

    'ReferenceNumber': {
      'required': 'This field is required.',
    },

    'Query': {
      'required': 'This field is required.',
    },

  };

  logValidationErrors(group: FormGroup = this.SupportQueryForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
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

  ModuleType: string = '';
  ngOnInit() {

    this.SupportQueryForm = this.fb.group({
      ModuleType: ['', [Validators.required]],
      Subject: ['', [Validators.required]],
      ReferenceNumber: ['', [Validators.required],],
      Query: ['', [Validators.required],],

    });

    localStorage.removeItem("helpmenucontent");
    this.onLoad();

    $(window).scroll(function () {
      if ($(this).scrollTop()) {
        $('#toTop').fadeIn();
      } else {
        $('#toTop').fadeOut();
      }
    });

    $("#toTop").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });

    //collapseing side bar
    var topbar = $(".page-topbar");
    var mainarea = $("#main-content");
    var menuarea = $(".page-sidebar");
    menuarea.addClass("collapseit").removeClass("expandit");
    topbar.addClass("sidebar_shift");
    mainarea.addClass("sidebar_shift");
    $('.logo-area').hide();

    this.GetModuleType();

  }

  leftmenus: Helpmenu[] = [] as any;
  griddata: Helpmenu[] = [] as any;
  onLoad() {

    if (localStorage.getItem("helpmenucontent") == null) {
      return this._HelpmenuService.search('ApplicationName', 'Jennifer', true).subscribe(
        (lst) => {
          if (lst != null) {
            debugger
            this.items = lst;
            this.leftmenus = lst;
            this.griddata = lst;
            localStorage.setItem("helpmenucontent", JSON.stringify(this.griddata));
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  filter(HelpMenuID: number): Helpmenu[] {
    let result: Helpmenu[] = [];
    let helpmenucontent = JSON.parse(localStorage.getItem("helpmenucontent"));
    this.items = helpmenucontent;
    result = helpmenucontent.filter(a => a.ParentId == HelpMenuID);
    return result;
  }

  childfilter(HelpMenuID: number): Helpmenu[] {
    let result: Helpmenu[] = [];
    let helpmenucontent = JSON.parse(localStorage.getItem("helpmenucontent"));
    this.items = helpmenucontent;
    result = helpmenucontent.filter(a => a.ParentId == HelpMenuID);
    return result;
  }



  scroll1(el: number) {
    this.SearchKeyword = '';
    let helpmenucontent = JSON.parse(localStorage.getItem("helpmenucontent"));
    this.items = helpmenucontent;
    document.querySelector('#div' + el).scrollIntoView(true);
    document.querySelector('#div' + el).scrollTop -= 220;
  }

  lstModuleType: Dropdown[];
  GetModuleType() {
    this._PrivateutilityService.GetValues('ModuleType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstModuleType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  SaveData() {
    this.objTicket.Query = this.SupportQueryForm.controls['Query'].value;;
    this.objTicket.ModuleType = this.SupportQueryForm.controls['ModuleType'].value;;
    this.objTicket.Subject = this.SupportQueryForm.controls['Subject'].value;;
    this.objTicket.ReferenceNumber = this.SupportQueryForm.controls['ReferenceNumber'].value;;
    this.objTicket.SupportQueryID = 0;

    this._ticketService.insert(this.objTicket).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          $('#modalstatusconfimation').modal('hide');
          this._router.navigate(['/Supporthistory']);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}

