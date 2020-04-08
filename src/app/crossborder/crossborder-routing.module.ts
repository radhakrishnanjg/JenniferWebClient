import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

import { S1Component } from './s1/s1.component';
import { CataloguelistComponent } from './cataloguelist/cataloguelist.component';
import { CataloguecreateComponent } from './cataloguecreate/cataloguecreate.component';
import { CatalogueviewComponent } from './catalogueview/catalogueview.component';
import { IORCataloguelistComponent } from './iorcataloguelist/iorcataloguelist.component';
import { IORCatalogueupdateComponent } from './iorcatalogueupdate/iorcatalogueupdate.component';
import { IORCatalogueviewComponent } from './iorcatalogueview/iorcatalogueview.component';
import { CustomcataloguelistComponent } from './customcataloguelist/customcataloguelist.component';
import { CustomcatalogueupdateComponent } from './customcatalogueupdate/customcatalogueupdate.component';
import { CustomcatalogueviewComponent } from './customcatalogueview/customcatalogueview.component';
import { EorcataloguelistComponent } from './eorcataloguelist/eorcataloguelist.component';
import { EorcatalogueviewComponent } from './eorcatalogueview/eorcatalogueview.component';

import { MobilemasterComponent } from './mobilemaster/mobilemaster.component';
import { MobilemasterlistComponent } from './mobilemasterlist/mobilemasterlist.component';
import { MobilemasterviewComponent } from './mobilemasterview/mobilemasterview.component';
import { MobilemasterotpComponent } from './mobilemasterotp/mobilemasterotp.component';
import { MobilemastersellerassignComponent } from './mobilemastersellerassign/mobilemastersellerassign.component';
import { SellerlistComponent } from './sellerlist/sellerlist.component';
import { EorsellerlistComponent } from './eorsellerlist/eorsellerlist.component';
import { EorsellerviewComponent } from './eorsellerview/eorsellerview.component';
import { SellerapprovalComponent } from './sellerapproval/sellerapproval.component';
import { SellerprofileComponent } from './sellerprofile/sellerprofile.component';
import { CrossborderuserlistComponent } from './crossborderuserlist/crossborderuserlist.component';
import { CrossborderuserComponent } from './crossborderuser/crossborderuser.component';
import { ChangepasswordComponent } from '../userprofile/changepassword/changepassword.component';
import { UserprofileComponent } from '../userprofile/userprofile/userprofile.component';

const routes: Routes = [
  { path: 'S1', component: S1Component },

  // { path: '', loadChildren: '../../src/app/userprofile/userprofile.module#UserprofileModule' },
  
  // { path: 'ChangePassword', component: ChangepasswordComponent },
  // { path: 'Profile', component: UserprofileComponent },
  // Catalogue module 
  { path: 'Cataloguelist', component: CataloguelistComponent, canActivate: [AuthGuard] }, //canActivate: [AuthGuard, StoreGuard]
  { path: 'Cataloguecreate/:id', component: CataloguecreateComponent, canActivate: [AuthGuard] },
  { path: 'Catalogueview/:id', component: CatalogueviewComponent, canActivate: [AuthGuard] },
  //IOR Catalogue
  { path: 'IORCataloguelist', component: IORCataloguelistComponent, canActivate: [AuthGuard] },
  { path: 'IORCatalogueupdate/:id', component: IORCatalogueupdateComponent, canActivate: [AuthGuard] },
  { path: 'IORCatalogueview/:id', component: IORCatalogueviewComponent, canActivate: [AuthGuard] },
  //Custom Catalogue
  { path: 'Customcataloguelist', component: CustomcataloguelistComponent, canActivate: [AuthGuard] },
  { path: 'Customcatalogueupdate/:id', component: CustomcatalogueupdateComponent, canActivate: [AuthGuard] },
  { path: 'Customcatalogueview/:id', component: CustomcatalogueviewComponent, canActivate: [AuthGuard] },
  //EOR Catalogue
  { path: 'EORCataloguelist', component: EorcataloguelistComponent, canActivate: [AuthGuard] },
  { path: 'EORCatalogueview/:id', component: EorcatalogueviewComponent, canActivate: [AuthGuard] },

  //Mobile Master  
  { path: 'Mobilemaster', component: MobilemasterComponent, canActivate: [AuthGuard] },
  { path: 'Mobilemasterlist', component: MobilemasterlistComponent, canActivate: [AuthGuard] },
  { path: 'Mobilemasterview/:id', component: MobilemasterviewComponent, canActivate: [AuthGuard] },
  { path: 'Mobilemasterotp/:id', component: MobilemasterotpComponent, canActivate: [AuthGuard] },
  { path: 'Mobilemastersellerassign/:id', component: MobilemastersellerassignComponent, canActivate: [AuthGuard] },

  //Seller Authorization  
  { path: 'EORSellerlist', component: EorsellerlistComponent, canActivate: [AuthGuard] },
  { path: 'EORSellerapproval/:id', component: EorsellerviewComponent, canActivate: [AuthGuard] },
  { path: 'Sellerlist', component: SellerlistComponent, canActivate: [AuthGuard] },
  { path: 'Sellerview/:id', component: SellerapprovalComponent, canActivate: [AuthGuard] },
  // Seller Profile
  { path: 'Sellerprofile', component: SellerprofileComponent, canActivate: [AuthGuard] },
  { path: 'Crossborderuserlist', component: CrossborderuserlistComponent, canActivate: [AuthGuard] },
  { path: 'Crossborderuser/:id', component: CrossborderuserComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrossborderRoutingModule { }
