import { Component, OnInit, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AuthenticationService } from '../_services/service/authentication.service';
import { Userpermission, Companydetails, CompanyRegister } from '../_services/model';
import { PrivateutilityService } from '../_services/service/privateutility.service';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CompanydetailService } from "../_services/service/companydetail.service";
import { ConnectionService } from 'ng-connection-service';
import { SellerregistrationService } from '../_services/service/crossborder/sellerregistration.service';
@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {


  fullName: string;
  Userpermissions: Userpermission[];
  lstCompanydetails: Companydetails[] = [] as any;
  objCompanydetails: Companydetails = {} as any;
  lstCompanies: CompanyRegister[];
  CompanyDetailID: number;
  usertype: string = '';
  ThemeSelector: Boolean = false;
  CompanyID: number;
  lightTheme: string = 'assets/images/lighttheme.jpg';
  darkTheme: string = 'assets/images/darktheme.jpg'
  themeUrl: string;
  SearchBy: string = '';
  // check internet connection

  status = 'ONLINE'; //initializing as online by default
  isConnected = true;
  constructor(
    private router: Router,
    private _alertService: ToastrService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,

    private _PrivateutilityService: PrivateutilityService,
    private EncrDecr: EncrDecrService,
    private _CompanydetailService: CompanydetailService,
    private connectionService: ConnectionService,
    private _SellerregistrationService: SellerregistrationService
  ) {
    this.objCompanydetails = new Companydetails();
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        // this.status = "ONLINE";
        // this.openSnackBar("Back to Online"); 
      } else {
        // this.status = "OFFLINE"
        this._alertService.info("Connection Lost. Please check your internet connection", 'Important!',
          {
            timeOut: 100000,
            positionClass: 'toast-bottom-center',
            progressBar: true,
            closeButton: true,
            tapToDismiss: false
          });
      }

    });


  }

  filterUser(user: Userpermission) {
    return !user.ParentId
  }

  filter(MenuID: number): Userpermission[] {
    let result: Userpermission[] = [];
    result = this.Userpermissions.filter(a => a.ParentId == MenuID && a.MenuType == 'SubMenu');
    return result;
  }
  fnusermenu_ViewEdit(id: number) {
    var parent = $('#' + id).parent().parent();
    var sub = $('#' + id).nextAll();
    parent.children('li.open').children('.sub-menu').slideUp(200);
    parent.children('li.open').children('a').children('.arrow').removeClass('open');
    parent.children('li').removeClass('open');
    if (sub.is(":visible")) {
      $('#' + id).find(".arrow").removeClass("open");
      sub.slideUp(200);
    } else {
      $('#' + id).parent().addClass("open");
      $('#' + id).find(".arrow").addClass("open");
      sub.slideDown(200);
    }
  }
  ngOnInit() {

    //newly added
    this.GetApplicationAccess();
    // Needs to use get cross border menus 

    localStorage.setItem("Theme_Name", "assets/litetheme.css");
    this.ThemeSelector = false;
    let head1 = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.id = 'mainStyle';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = localStorage.getItem("Theme_Name"); // you may want to get this from local storage or location
    head1.appendChild(link);
    /*--------------------------------
         Collapsed Main Menu
     --------------------------------*/
    var topbar = $(".page-topbar");
    var mainarea = $("#main-content");
    var menuarea = $(".page-sidebar");
    $('.page-topbar .sidebar_toggle').on('click', function () {
      if (menuarea.hasClass("collapseit") || menuarea.hasClass("chat_shift")) {
        menuarea.addClass("expandit").removeClass("collapseit");
        topbar.removeClass("sidebar_shift");
        mainarea.removeClass("sidebar_shift");
        $('.logo').show();
        $('.logotogl').hide();
        $('.navbar-header').css("width", "218px");
      } else {
        menuarea.addClass("collapseit").removeClass("expandit");
        topbar.addClass("sidebar_shift");
        mainarea.addClass("sidebar_shift");
        $('.logo').hide();
        $('.navbar-header').css("width", "36px");
        $('.logotogl').show();
      }
    });

    $("body").click(function (e) {
      $(".page-sidebar.collapseit .wraplist li.open .sub-menu").attr("style", "");
      $(".page-sidebar.collapseit .wraplist li.open").removeClass("open");
      $(".page-sidebar.chat_shift .wraplist li.open .sub-menu").attr("style", "");
      $(".page-sidebar.chat_shift .wraplist li.open").removeClass("open");
    });
  }



  onchangeCompanyID(selectedValue: string) {
    let id = parseInt(selectedValue);
    let currentUser = this.authenticationService.currentUserValue;
    currentUser.CompanyID = id;
    //
    this._PrivateutilityService.getTopUserStores(id)
      .subscribe(
        (data: Companydetails[]) => {
          this.lstCompanydetails = data;
          if (this.lstCompanydetails != null && this.lstCompanydetails.length > 0) {
            this.CompanyDetailID = this.lstCompanydetails[0].CompanyDetailID;
          }
          currentUser.CompanyDetailID = this.CompanyDetailID;
          var encrypted = this.EncrDecr.set('Radha@123!()', JSON.stringify(currentUser));
          localStorage.setItem('currentJennifer1', encrypted);
          this.router.navigate(['/Dashboard1']);
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
  }

  onchangeCompanyDetailID(selectedValue: string) {
    let id = parseInt(selectedValue);
    let currentUser = this.authenticationService.currentUserValue;
    currentUser.CompanyDetailID = id;
    var encrypted = this.EncrDecr.set('Radha@123!()', JSON.stringify(currentUser));
    localStorage.setItem('currentJennifer1', encrypted);
    this.router.navigate(['/Dashboard1']);
  }

  onchangeThemeSelector(event: any) {
    if (this.ThemeSelector) {
      this.themeUrl = this.darkTheme;
    }
    else {
      this.themeUrl = this.lightTheme;
    }
  }

  SaveTheme() {
    if (this.ThemeSelector) {
      if ($('#mainStyle').length != 0) {
        let head = document.getElementsByTagName('head')[0];
        var element = document.getElementById("mainStyle");
        head.removeChild(element);
      }
      let head1 = document.getElementsByTagName('head')[0];
      let link = document.createElement('link');
      link.id = 'mainStyle';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/darktheme.css'; // you may want to get this from local storage or location
      head1.appendChild(link);
      localStorage.setItem("Theme_Name", "assets/darktheme.css");
      this.ThemeSelector = true;
    }
    else {
      if ($('#mainStyle').length != 0) {
        let head = document.getElementsByTagName('head')[0];
        var element = document.getElementById("mainStyle");
        head.removeChild(element);
      }
      let head1 = document.getElementsByTagName('head')[0];
      let link = document.createElement('link');
      link.id = 'mainStyle';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/litetheme.css'; // you may want to get this from local storage or location
      head1.appendChild(link);
      localStorage.setItem("Theme_Name", "assets/litetheme.css");
      this.ThemeSelector = false;
    }
  }

  logout() {

    this.authenticationService.logout();
    this._alertService.success('You are logged out successfully');
    this.router.navigate(['/Signin']);

    // //
    // this.authenticationService.logout().subscribe(
    //   (data) => {
    //     //
    //     localStorage.clear();
    //     if (data != null && data == true) {
    //       this._alertService.success('You are logged out successfully');
    //       this.router.navigate(['/Signin']);
    //     }
    //     else {
    //       this._alertService.error('Invalid Details.!');
    //       this.router.navigate(['/Signin']);
    //     }

    //   },
    //   (error: any) => {
    //     //
    //     this._alertService.error('Invalid Details.!');
    //   }
    // );
  }

  SearchData() {
    if (this.SearchBy != '') {
      this.router.navigate(['/Search', this.SearchBy]);
    }
  }

  IsSwitchApplicationEnable: boolean = false;
  GetApplicationAccess() { 
    let currentUser = this.authenticationService.currentUserValue;
    this.fullName = currentUser.FirstName + ' ' + currentUser.LastName;
    this.usertype = currentUser.UserType;
    this.Userpermissions = currentUser.lstUserPermission.filter(a => a.ParentId != 120 && a.MenuID != 120);
    if (this.Userpermissions.filter(a => a.ApplicationName == "Jennifer").length > 1 &&
      this.Userpermissions.filter(a => a.ApplicationName == "CrossBorder").length > 1) {
      this.IsSwitchApplicationEnable = true;
    }
    else {
      this.IsSwitchApplicationEnable = false;
    }
    this.Userpermissions = this.Userpermissions.filter(a => a.ApplicationName == 'CrossBorder');

    // this._SellerregistrationService.GetApplicationAccess()
    //   .subscribe(
    //     data => {
    //       if (data != null && data.length == 2 && data[0].ApplicationName == 'CrossBorder') {
    //         this.IsSwitchApplicationEnable = true;
    //       }
    //       else {
    //         this.IsSwitchApplicationEnable = false;
    //       }
    //     },
    //     error => {
    //     });
  }

}
