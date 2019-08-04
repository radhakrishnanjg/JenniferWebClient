import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from  '../../_services/service/contact.service';
import { Contact } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit {
  //#region variable declartion

  lst: Contact[];
  obj: Contact;
  confirmDelete = false;
  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _contactService: ContactService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '', true);
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {

    this._spinner.show();
    return this._contactService.search(SearchBy, Search, IsActive).subscribe(
      (data) => {
        this.lst = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search":'Filter',
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
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '',
    this.SearchKeyword = '',
    this.Searchaction = true;
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Contactlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Contact', id]);
  }

  confirmDeleteid(id: number, DeleteColumnValue: string) {
    if (this._authorizationGuard.CheckAcess("Contactlist", "ViewEdit")) {
      return;
    }
    this.confirmDelete = true;
    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnValue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._contactService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Contact data has been deleted successfully');
        }
        else {
          this.alertService.error('Contact - ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this.confirmDelete = false;
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    )
  }

}
