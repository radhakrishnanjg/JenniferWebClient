import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submenu1',
  templateUrl: './submenu1.component.html',
  styleUrls: ['./submenu1.component.css']
})
export class Submenu1Component implements OnInit {

  constructor(
    private router: Router, ) { }

  ngOnInit() {
  }

  gotosubmenu2() { 
    this.router.navigate(['/CrossBorder/SubMenu2']);
  } 
}
