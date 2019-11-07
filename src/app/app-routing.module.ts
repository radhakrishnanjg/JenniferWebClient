import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, MaintenanceGuard } from './_guards';
// Import the components so they can be referenced in routes

import { PrivatelayoutComponent } from './privatelayout/privatelayout.component';
import { HelpnavigationComponent } from './help/helpnavigation/helpnavigation.component';
import { HelpmenulistComponent } from './help/helpmenulist/helpmenulist.component';
import { HelpmenuComponent } from './help/helpmenu/helpmenu.component';
import { Dashboard1Component } from './dashboard1/dashboard1.component';


import { CompanyregisterComponent } from './account/companyregister/companyregister.component';
import { SigninComponent } from './account/signin/signin.component';
import { ForgotpasswordComponent } from './account/forgotpassword/forgotpassword.component';


import { UserlistComponent } from './users/userlist/userlist.component';
import { UserComponent } from './users/user/user.component';
import { UserpermissionComponent } from './users/userpermission/userpermission.component';
import { ChangepasswordComponent } from './users/changepassword/changepassword.component';
import { CompanydetailsComponent } from './users/companydetails/companydetails.component';
import { CompanydetaillistComponent } from './users/companydetaillist/companydetaillist.component';
import { UserprofileComponent } from './users/userprofile/userprofile.component';
import { CompanyprofileComponent } from './users/companyprofile/companyprofile.component';

import { DropdownlistComponent } from './premaster/dropdownlist/dropdownlist.component';
import { MarketplacelistComponent } from './premaster/marketplacelist/marketplacelist.component';
import { CompanylistComponent } from './premaster/companylist/companylist.component';
import { CompanyComponent } from './premaster/company/company.component';
import { MenulistComponent } from './premaster/menulist/menulist.component';


import { BrandlistComponent } from './masters/brandlist/brandlist.component';
import { CategorylistComponent } from './masters/categorylist/categorylist.component';
import { SubcategorylistComponent } from './masters/subcategorylist/subcategorylist.component';
import { ProductgrouplistComponent } from './masters/productgrouplist/productgrouplist.component';
import { LocationComponent } from './masters/location/location.component';
import { LocationlistComponent } from './masters/locationlist/locationlist.component';
import { ItemComponent } from './masters/item/item.component';
import { ItemlistComponent } from './masters/itemlist/itemlist.component';
import { UomlistComponent } from './masters/uomlist/uomlist.component';
import { DiscountlistComponent } from './masters/discountlist/discountlist.component';
import { MarketplacefeelistComponent } from './masters/marketplacefeelist/marketplacefeelist.component';
import { MasteruploadlistComponent } from './masters/masteruploadlist/masteruploadlist.component';
import { MasteruploadComponent } from './masters/masterupload/masterupload.component';

import { EmailconfigComponent } from './emailconfiguration/emailconfig/emailconfig.component';
import { ContactComponent } from './emailconfiguration/contact/contact.component';
import { ContactlistComponent } from './emailconfiguration/contactlist/contactlist.component';

import { CustomerComponent } from './customers/customer/customer.component';
import { CustomerlistComponent } from './customers/customerlist/customerlist.component';
import { CustomerwarehouseComponent } from './customers/customerwarehouse/customerwarehouse.component';
import { CustomerwarehouselistComponent } from './customers/customerwarehouselist/customerwarehouselist.component';
import { CustomeritemlistComponent } from './customers/customeritemlist/customeritemlist.component';

import { VendorComponent } from './vendors/vendor/vendor.component';
import { VendorlistComponent } from './vendors/vendorlist/vendorlist.component';
import { VendoritemlistComponent } from './vendors/vendoritemlist/vendoritemlist.component';
import { VendorwarehouselistComponent } from './vendors/vendorwarehouselist/vendorwarehouselist.component';
import { VendorwarehouseComponent } from './vendors/vendorwarehouse/vendorwarehouse.component';

import { PolistComponent } from './purchaseorder/polist/polist.component';
import { PoComponent } from './purchaseorder/po/po.component';
import { PoapprovallistComponent } from './purchaseorder/poapprovallist/poapprovallist.component';
import { PoapprovalComponent } from './purchaseorder/poapproval/poapproval.component';
import { PoshipmentlistComponent } from './purchaseorder/poshipmentlist/poshipmentlist.component';
import { PoshipmentComponent } from './purchaseorder/poshipment/poshipment.component';

import { ShipmentviewComponent } from './purchaseorder/shipmentview/shipmentview.component';
import { PurchaselistComponent } from './purchaseorder/purchaselist/purchaselist.component';
import { PurchaseComponent } from './purchaseorder/purchase/purchase.component';
import { PurchaseviewComponent } from './purchaseorder/purchaseview/purchaseview.component';
import { PoviewComponent } from './purchaseorder/poview/poview.component';
import { BoeComponent } from './purchaseorder/boe/boe.component';
import { BoelistComponent } from './purchaseorder/boelist/boelist.component';
import { BoeviewComponent } from './purchaseorder/boeview/boeview.component';

import { GoodsinwardComponent } from './goods/goodsinward/goodsinward.component';
import { GoodsinwardlistComponent } from './goods/goodsinwardlist/goodsinwardlist.component';
import { GoodsstorageComponent } from './goods/goodsstorage/goodsstorage.component';
import { GoodsstoragelistComponent } from './goods/goodsstoragelist/goodsstoragelist.component';
import { GoodsReceiptListComponent } from './goods/goods-receipt-list/goods-receipt-list.component';
import { GoodsReceiptComponent } from './goods/goods-receipt/goods-receipt.component';
import { GoodsDisputeComponent } from './goods/goods-dispute/goods-dispute.component';
import { GoodsDisputeListComponent } from './goods/goods-dispute-list/goods-dispute-list.component';
import { StoListComponent } from './goods/sto-list/sto-list.component';
import { StoComponent } from './goods/sto/sto.component';
import { StoeditComponent } from './goods/stoedit/stoedit.component';
import { InventorydetaillistComponent } from './goods/inventorydetaillist/inventorydetaillist.component';
import { GoodsreceiptviewComponent } from './goods/goodsreceiptview/goodsreceiptview.component';
import { GoodsdisputeviewComponent } from './goods/goodsdisputeview/goodsdisputeview.component';
import { StoviewComponent } from './goods/stoview/stoview.component';

import { SalesratecardlistComponent } from './sales/salesratecardlist/salesratecardlist.component';
import { SalesorderlistComponent } from './sales/salesorderlist/salesorderlist.component';
import { SalesorderComponent } from './sales/salesorder/salesorder.component';
import { SalesorderviewComponent } from './sales/salesorderview/salesorderview.component';
import { SalesShipmentComponent } from './sales/sales-shipment/sales-shipment.component';
import { SalesShipmentListComponent } from './sales/sales-shipment-list/sales-shipment-list.component';
import { ShipmentoutwardlistComponent } from './sales/shipmentoutwardlist/shipmentoutwardlist.component';
import { PicklistComponent } from './sales/picklist/picklist.component';
import { PicklistsearchComponent } from './sales/picklistsearch/picklistsearch.component';
import { PicklistviewComponent } from './sales/picklistview/picklistview.component';
import { SalesinvoiceComponent } from './sales/salesinvoice/salesinvoice.component';
import { ReceiptslistComponent } from './sales/receiptslist/receiptslist.component';
import { SalesorderunsellableComponent } from './sales/salesorderunsellable/salesorderunsellable.component';
import { SalesorderapprovallistComponent } from './sales/salesorderapprovallist/salesorderapprovallist.component';
import { SalesorderapprovalComponent } from './sales/salesorderapproval/salesorderapproval.component';



import { ReportmasterlistComponent } from './download/reportmasterlist/reportmasterlist.component';
import { ReportmasterComponent } from './download/reportmaster/reportmaster.component';
import { ReportsinventoryComponent } from './download/reportsinventory/reportsinventory.component';
import { ReportsamazonComponent } from './download/reportsamazon/reportsamazon.component';
import { ReportscomplianceComponent } from './download/reportscompliance/reportscompliance.component';
import { ReportsanalyticsComponent } from './download/reportsanalytics/reportsanalytics.component';
import { ReportsmisComponent } from './download/reportsmis/reportsmis.component';
import { ReportsothersComponent } from './download/reportsothers/reportsothers.component';
import { ReportAmazonMTRComponent } from './download/report-amazon-mtr/report-amazon-mtr.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SearchComponent } from './search/search.component';
import {  DynamicformComponent } from './dynamicform/dynamicform.component';

import { StatementlistComponent } from './download/statementlist/statementlist.component';
import { StatementviewComponent } from './download/statementview/statementview.component';
 

// The last route is the empty path route. This specifies
// the route to redirect to if the client side path is empty.
const appRoutes: Routes = [
  //Site routes goes here 

  // App routes goes here here
  {
    path: '',
    component: PrivatelayoutComponent,
    children: [
      { path: 'Dashboard1', component: Dashboard1Component },
      //users module      
      { path: 'Userlist', component: UserlistComponent, canActivate: [AuthGuard] },
      { path: 'User/:id', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'Userpermission/:id/:email', component: UserpermissionComponent, canActivate: [AuthGuard] },
      { path: 'ChangePassword', component: ChangepasswordComponent },
      { path: 'Profile', component: UserprofileComponent },
      { path: 'CompanyProfile', component: CompanyprofileComponent },

      { path: 'Companydetails/:id', component: CompanydetailsComponent, canActivate: [AuthGuard] },
      { path: 'Companydetaillist', component: CompanydetaillistComponent, canActivate: [AuthGuard] },
      //masters module
      { path: 'Location/:id', component: LocationComponent, canActivate: [AuthGuard] },
      { path: 'Locationlist', component: LocationlistComponent, canActivate: [AuthGuard] },
      { path: 'Item/:id', component: ItemComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Itemlist', component: ItemlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Brandlist', component: BrandlistComponent, canActivate: [AuthGuard] },
      { path: 'Productgrouplist', component: ProductgrouplistComponent, canActivate: [AuthGuard] },
      { path: 'Categorylist', component: CategorylistComponent, canActivate: [AuthGuard] },
      { path: 'SubCategorylist', component: SubcategorylistComponent, canActivate: [AuthGuard] },
      { path: 'Uomlist', component: UomlistComponent, canActivate: [AuthGuard] },
      { path: 'Discountlist', component: DiscountlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Marketplacefeelist', component: MarketplacefeelistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'MasterUploadList', component: MasteruploadlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'MasterUpload/:id', component: MasteruploadComponent, canActivate: [AuthGuard, StoreGuard] },

      //vendor module
      { path: 'Vendor/:id', component: VendorComponent, canActivate: [AuthGuard] },
      { path: 'Vendorlist', component: VendorlistComponent, canActivate: [AuthGuard] },
      { path: 'Vendorwarehouse/:id', component: VendorwarehouseComponent, canActivate: [AuthGuard] },
      { path: 'Vendorwarehouselist', component: VendorwarehouselistComponent, canActivate: [AuthGuard] },
      { path: 'Vendoritemlist', component: VendoritemlistComponent, canActivate: [AuthGuard, StoreGuard] },

      // customer module
      { path: 'Customer/:id', component: CustomerComponent, canActivate: [AuthGuard] },
      { path: 'Customerlist', component: CustomerlistComponent, canActivate: [AuthGuard] },
      { path: 'Customerwarehouse/:id', component: CustomerwarehouseComponent, canActivate: [AuthGuard] },
      { path: 'Customerwarehouselist', component: CustomerwarehouselistComponent, canActivate: [AuthGuard] },
      { path: 'Customeritemlist', component: CustomeritemlistComponent, canActivate: [AuthGuard, StoreGuard] },

      //Emailconfiguration Module 
      { path: 'Emailconfig', component: EmailconfigComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Contact/:id', component: ContactComponent, canActivate: [AuthGuard] },
      { path: 'Contactlist', component: ContactlistComponent, canActivate: [AuthGuard] },

      // po ,shipment , purchase and sto  screens
      { path: 'Polist', component: PolistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'PO/:id', component: PoComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Poapprovallist', component: PoapprovallistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Poapproval/:id', component: PoapprovalComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Poshipmentlist', component: PoshipmentlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Poshipment/:id/:PoId', component: PoshipmentComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Poshipmentview/:id/:PoId', component: ShipmentviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Purchaselist', component: PurchaselistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Purchase/:id/:PoId', component: PurchaseComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'POview/:id', component: PoviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Purchaseview/:id/:PoId', component: PurchaseviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'BOElist', component: BoelistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'BOE/:id/:PurchaseId', component: BoeComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'BOEview/:id/:PurchaseId', component: BoeviewComponent, canActivate: [AuthGuard, StoreGuard] },


      //Goods Receipt
      { path: 'Goodsreceipt/:id', component: GoodsReceiptComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsreceiptlist', component: GoodsReceiptListComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsdispute/:id', component: GoodsDisputeComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsdisputelist', component: GoodsDisputeListComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsinward/:id', component: GoodsinwardComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsinwardlist', component: GoodsinwardlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsstorage/:id', component: GoodsstorageComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsstoragelist', component: GoodsstoragelistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'StoList', component: StoListComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Sto/:id', component: StoComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'StoEdit/:id', component: StoeditComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Stoview/:id', component: StoviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Inventorydetaillist', component: InventorydetaillistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsreceiptview/:id', component: GoodsreceiptviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Goodsdisputeview/:id', component: GoodsdisputeviewComponent, canActivate: [AuthGuard, StoreGuard] },
      // Sales module
      { path: 'Salesorder/:id', component: SalesorderComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesorderunsellable/:id', component: SalesorderunsellableComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesorderview/:id', component: SalesorderviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesorderlist', component: SalesorderlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesorderapproval/:id', component: SalesorderapprovalComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesorderapprovallist', component: SalesorderapprovallistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesshipment/:id', component: SalesShipmentComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Salesshipmentlist', component: SalesShipmentListComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Shipmentoutwardlist', component: ShipmentoutwardlistComponent, canActivate: [AuthGuard] },
      { path: 'Salesratecardlist', component: SalesratecardlistComponent, canActivate: [AuthGuard, StoreGuard] },

      { path: 'Picklist/:id', component: PicklistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'PickListView/:id', component: PicklistviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Picklistsearch', component: PicklistsearchComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'SalesInvoice/:id', component: SalesinvoiceComponent, },
      { path: 'Receiptslist', component: ReceiptslistComponent, canActivate: [AuthGuard, StoreGuard] },

      // Pre master module  
      { path: 'Companylist', component: CompanylistComponent, canActivate: [AuthGuard] },
      { path: 'Company/:id', component: CompanyComponent, canActivate: [AuthGuard] },
      { path: 'Menulist', component: MenulistComponent, canActivate: [AuthGuard] },
      { path: 'Dropdownlist', component: DropdownlistComponent, canActivate: [AuthGuard] },
      { path: 'Marketplacelist', component: MarketplacelistComponent, canActivate: [AuthGuard] },


      //download section
      { path: 'Reportmaster/:id', component: ReportmasterComponent, canActivate: [AuthGuard] },
      { path: 'Reportmasterlist', component: ReportmasterlistComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Reportsinventory', component: ReportsinventoryComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Reportsamazon', component: ReportsamazonComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Reportscompliance', component: ReportscomplianceComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Reportsanalytics', component: ReportsanalyticsComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Reportsmis', component: ReportsmisComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Reportsothers', component: ReportsothersComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'ReportAmazonMTR', component: ReportAmazonMTRComponent, canActivate: [AuthGuard, StoreGuard] },

      { path: 'Statementview/:id', component: StatementviewComponent, canActivate: [AuthGuard, StoreGuard] },
      { path: 'Statementlist', component: StatementlistComponent, canActivate: [AuthGuard, StoreGuard] },

  
      { path: '', loadChildren: './cases/cases.module#CasesModule' },

      { path: '', loadChildren: './help/help.module#HelpModule' },
 
      { path: 'Search/:key', component: SearchComponent },
      { path: 'DynamicForm', component: DynamicformComponent },
      { path: '', redirectTo: '/Signin', pathMatch: 'full', canActivate: [MaintenanceGuard] },
      
      // .. routes 
      // {
      //   path: 'not-found',
      //   loadChildren: './not-found/not-found.module#NotFoundModule'
      // },
      // {
      //   path: '**',
      //   redirectTo: 'not-found'
      // },
    ]
  },
  //no layout routes
  
  { path: '', redirectTo: '/Signin', pathMatch: 'full', canActivate: [MaintenanceGuard] },
  { path: 'Signin', component: SigninComponent, canActivate: [MaintenanceGuard] },//canActivate: [MaintenanceGuard]
  { path: 'ForgotPassword', component: ForgotpasswordComponent },
  { path: 'Companyregister', component: CompanyregisterComponent },
  { path: 'Maintenance', component: MaintenanceComponent },
  // { path: 'Requestform', component: RequestformComponent, },

];

// Pass the configured routes to the forRoot() method
// to let the angular router know about our routes
// Export the imported RouterModule so router directives
// are available to the module that imports this AppRoutingModule
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    initialNavigation: 'enabled', onSameUrlNavigation: 'reload'
  })

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
