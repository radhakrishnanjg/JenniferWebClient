import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, MaintenanceGuard } from './_guards';
// Import the components so they can be referenced in routes

import { PrivatelayoutComponent } from './privatelayout/privatelayout.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { Dashboard1Component } from './dashboard1/dashboard1.component';

import { CompanyregisterComponent } from './account/companyregister/companyregister.component';
import { SigninComponent } from './account/signin/signin.component';
import { ForgotpasswordComponent } from './account/forgotpassword/forgotpassword.component';


import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SearchComponent } from './search/search.component';
import { IndexComponent } from './index/index.component';

// The last route is the empty path route. This specifies
// the route to redirect to if the client side path is empty.
const appRoutes: Routes = [
  //Landing page
  { path: '', component: IndexComponent },
  //Site routes goes here  
  {
    path: '',
    component: PrivatelayoutComponent,
    children: [
      { path: 'Dashboard1', component: Dashboard1Component },

      // prasanth intgration
      { path: '', loadChildren: './amazonrtv/amazonrtv.module#AmazonrtvModule' },
      { path: '', loadChildren: './customers/customers.module#CustomersModule' },
      { path: '', loadChildren: './download/download.module#DownloadModule' },
      { path: '', loadChildren: './emailconfiguration/emailconfiguration.module#EmailconfigurationModule' },
      { path: '', loadChildren: './gst/gst.module#GstModule' },
      { path: '', loadChildren: './goods/goods.module#GoodsModule' },

      //abdul 
      { path: '', loadChildren: './cases/cases.module#CasesModule' },
      { path: '', loadChildren: './help/help.module#HelpModule' },
      { path: '', loadChildren: './masters/masters.module#MastersModule' },
      { path: '', loadChildren: './premaster/premaster.module#PremasterModule' },
      { path: '', loadChildren: './purchaseorder/purchaseorder.module#PurchaseorderModule' },
      { path: '', loadChildren: './sales/sales.module#SalesModule' },
      { path: '', loadChildren: './userprofile/userprofile.module#UserprofileModule' },
      { path: '', loadChildren: './users/users.module#UsersModule' },
      { path: '', loadChildren: './vendors/vendors.module#VendorsModule' },

      { path: 'Search/:key', component: SearchComponent },


    ]
  },
  //no layout routes 
  { path: 'Signin', component: SigninComponent, canActivate: [MaintenanceGuard] },
  { path: 'ForgotPassword', component: ForgotpasswordComponent },
  { path: 'Companyregister', component: CompanyregisterComponent },
  { path: 'Maintenance', component: MaintenanceComponent },
  { path: 'Termsofuse', component: TermsofuseComponent },
  { path: 'PrivacyPolicy', component: PrivacyPolicyComponent },
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
  imports: [RouterModule.forRoot(appRoutes, {
    initialNavigation: 'enabled', onSameUrlNavigation: 'reload'
  })

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
