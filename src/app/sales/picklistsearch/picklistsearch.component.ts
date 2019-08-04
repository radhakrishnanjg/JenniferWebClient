import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PicklistService } from '../../_services/service/picklist.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Picklistheader, Location } from '../../_services/model';
// import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-picklistsearch',
  templateUrl: './picklistsearch.component.html',
  styleUrls: ['./picklistsearch.component.css']
})
export class PicklistsearchComponent implements OnInit {
  lstPicklist: Picklistheader[];
  obj: Picklistheader;
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  LocationID: number = 0;
  locations: Location[];
  dtOptions: DataTables.Settings = {};
  selectedDeleteId: number;
  
  // items = [{ title: 'first' }, { title: 'second' }] // Content of the pages
  // counter: number
  // length: number
  // pdf: jsPDF

  // downloadPDF() {
  //   this.pdf = new jsPDF('p', 'mm', 'a4') // A4 size page of PDF
  //   this.length = this.items.length
  //   this.counter = 0

  //   this.generatePDF()
  // }

  // generatePDF() {
  //   var data = document.getElementById('pdf' + this.counter)
  //   //var data = document.getElementById('samplepdf');
  //   html2canvas(data, {
  //     scale: 3 // make better quality ouput
  //   }).then((canvas) => {
  //     this.counter++

  //     // Few necessary setting options
  //     var imgWidth = 208
  //     var imgHeight = (canvas.height * imgWidth) / canvas.width

  //     const contentDataURL = canvas.toDataURL('image/png')
  //     var position = 0
  //     this.pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)

  //     // Control if new page needed, else generate the pdf
  //     if (this.counter < this.length) {
  //       this.pdf.addPage()
  //       //this.getLetter()
  //     } else {
  //       this.pdf.save('samplepdf.pdf') // Generated PDF
  //       return true
  //     }
  //   })
  // }

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _picklistService: PicklistService,
    private _privateutilityService: PrivateutilityService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.LocationID = 0;
    this._spinner.show();
    this._privateutilityService.getLocations()
      .subscribe(
        (data: Location[]) => {
          this.locations = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err);
        }
      );
  }

  onLoad(SearchBy: string, Search: string, LocationID: number) {
    this._spinner.show();
    return this._picklistService.search(SearchBy, Search, LocationID).subscribe(
      (data) => {
        this.lstPicklist = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.LocationID);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.LocationID = 0;
  }


  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Picklistsearch", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Picklist', id]);
  }

  editInvoiceClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Picklistsearch", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/SalesInvoice', id]);
  }
}
