import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';
import { AuthGuard, StoreGuard, MaintenanceGuard } from './_guards';
// Import the components so they can be referenced in routes

import { PrivatelayoutComponent } from './privatelayout/privatelayout.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { Dashboard1Component } from './dashboard1/dashboard1.component';

import { CompanyregisterComponent } from './account/companyregister/companyregister.component';
import { SigninComponent } from './account/signin/signin.component';
import { ForgotpasswordComponent } from './account/forgotpassword/forgotpassword.component';
import { SellerregistrationComponent } from './account/sellerregistration/sellerregistration.component';


import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SearchComponent } from './search/search.component';
import { IndexComponent } from './index/index.component';

import { SellercentralaccessComponent } from './sellercentralaccess/sellercentralaccess.component';
import { PspaccessComponent } from './pspaccess/pspaccess.component';
import { CustompreloadingService } from './_services/service/custompreloading.service';

// The last route is the empty path route. This specifies
// the route to redirect to if the client side path is empty.
const appRoutes: Routes = [
  //Landing page
  { path: '', component: IndexComponent },
  //Site routes goes here  
  {
    path: '',
    data: { preload: false },
    component: PrivatelayoutComponent,
    children: [
      { path: 'Dashboard1', component: Dashboard1Component },

      // prasanth intgration
      { path: '', data: { preload: true }, loadChildren: './amazonrtv/amazonrtv.module#AmazonrtvModule' },
      { path: '', loadChildren: './customers/customers.module#CustomersModule' },
      { path: '', loadChildren: './download/download.module#DownloadModule' },
      { path: '', loadChildren: './emailconfiguration/emailconfiguration.module#EmailconfigurationModule' },
      { path: '', loadChildren: './gst/gst.module#GstModule' },
      { path: '', loadChildren: './goods/goods.module#GoodsModule' },

      //abdul 
      { path: '', loadChildren: './cases/cases.module#CasesModule' },
      { path: '', loadChildren: './help/help.module#HelpModule' },
      { path: '', loadChildren: './masters/masters.module#MastersModule' },
      { path: '', data: { preload: false }, loadChildren: './premaster/premaster.module#PremasterModule' },
      { path: '', loadChildren: './purchaseorder/purchaseorder.module#PurchaseorderModule' },
      { path: '', loadChildren: './sales/sales.module#SalesModule' },
      { path: '', loadChildren: './userprofile/userprofile.module#UserprofileModule' },
      { path: '', loadChildren: './users/users.module#UsersModule' },
      { path: '', loadChildren: './vendors/vendors.module#VendorsModule' },


      { path: '', data: { preload: false }, loadChildren: './pricing/pricing.module#PricingModule' },
      { path: '', data: { preload: false }, loadChildren: './journals/journals.module#JournalsModule' },

      { path: '', loadChildren: './payments/payments.module#PaymentsModule' },
      { path: '', loadChildren: './management/management.module#ManagementModule' },

      { path: 'Search/:key', component: SearchComponent },


    ]
  },
  //no layout routes  
  { path: 'Signin', component: SigninComponent, canActivate: [] },
  { path: 'ForgotPassword', component: ForgotpasswordComponent },
  { path: 'Companyregister', component: CompanyregisterComponent },
  { path: 'Sellerregistration', component: SellerregistrationComponent },
  { path: 'Maintenance', component: MaintenanceComponent },
  { path: 'Termsofuse', component: TermsofuseComponent },
  { path: 'PrivacyPolicy', component: PrivacyPolicyComponent },
  //added two additional for redirection purpose.
  { path: 'SellerCentral', component: SellercentralaccessComponent },
  { path: 'PSP', component: PspaccessComponent },
  // otherwise redirect to home 
  {
    path: 'not-found',
    loadChildren: './not-found/not-found.module#NotFoundModule'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];

// Pass the configured routes to the forRoot() method
// to let the angular router know about our routes
// Export the imported RouterModule so router directives
// are available to the module that imports this AppRoutingModule
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
