import { Component, OnInit } from '@angular/core';

import { Helpmenu } from '../../_services/model/helpmenu';
import { HelpmenuService } from '../../_services/service/helpmenu.service';

@Component({
  selector: 'app-helpnavigation',
  templateUrl: './helpnavigation.component.html',
  styleUrls: ['./helpnavigation.component.scss']
})

export class HelpnavigationComponent implements OnInit {

  items: Helpmenu[] = [] as any;
  leftmenus: Helpmenu[] = [] as any;
  SearchKeyword: string = '';
  constructor(
    
    private _HelpmenuService: HelpmenuService,
  ) { }


  onLoad() {

    if (localStorage.getItem("helpmenucontent") == null) {
      //
      return this._HelpmenuService.search('PageContent', '', true).subscribe(
        (lst) => {
          if (lst != null) {
            this.items = lst;
            debugger
            this.leftmenus = lst;
            localStorage.setItem("helpmenucontent", JSON.stringify(lst));
          }
          //
        },
        (err) => {
          //
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

  // Refresh(): void {
  //   this.SearchKeyword = ''
  //   let helpmenucontent = JSON.parse(localStorage.getItem("helpmenucontent"));
  //   this.items = helpmenucontent;
  // }

  ngOnInit() {
    localStorage.removeItem("helpmenucontent");
    this.onLoad();
    
    $(window).scroll(function() {
      if ($(this).scrollTop()) {
        $('#toTop').fadeIn();
      } else {
        $('#toTop').fadeOut();
      }
    });
    
     $("#toTop").click(function () { 
        $("html, body").animate({scrollTop: 0}, 1000);
    });

    //collapseing side bar
    var topbar = $(".page-topbar");
    var mainarea = $("#main-content");
    var menuarea = $(".page-sidebar");
    menuarea.addClass("collapseit").removeClass("expandit");
    topbar.addClass("sidebar_shift");
    mainarea.addClass("sidebar_shift");
    $('.logo-area').hide();


   
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  scroll1(el: number) {
    this.SearchKeyword = '';
    let helpmenucontent = JSON.parse(localStorage.getItem("helpmenucontent"));
    this.items = helpmenucontent;
    document.querySelector('#div' + el).scrollIntoView();
  }

}

