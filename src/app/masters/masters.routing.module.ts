import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

//masters  
import { BrandlistComponent } from '../masters/brandlist/brandlist.component';
import { CategorylistComponent } from '../masters/categorylist/categorylist.component';
import { SubcategorylistComponent } from '../masters/subcategorylist/subcategorylist.component';
import { ProductgrouplistComponent } from '../masters/productgrouplist/productgrouplist.component';
import { LocationComponent } from '../masters/location/location.component';
import { LocationlistComponent } from '../masters/locationlist/locationlist.component';
import { ItemComponent } from '../masters/item/item.component';
import { ItemlistComponent } from '../masters/itemlist/itemlist.component';
import { UomlistComponent } from '../masters/uomlist/uomlist.component';
import { MasteruploadlistComponent } from '../masters/masteruploadlist/masteruploadlist.component';
import { MasteruploadComponent } from '../masters/masterupload/masterupload.component';
import { VoucherlistComponent } from './voucherlist/voucherlist.component';
import { LedgerlistComponent } from './ledgerlist/ledgerlist.component';
import { PpoblistComponent } from './ppoblist/ppoblist.component';
import { PpobComponent } from './ppob/ppob.component';
import { TaxledgerComponent } from './taxledger/taxledger.component';

const appRoutes: Routes = [
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
  { path: 'MasterUploadList', component: MasteruploadlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'MasterUpload/:id', component: MasteruploadComponent, canActivate: [AuthGuard, StoreGuard] },

  { path: 'Voucherlist', component: VoucherlistComponent, canActivate: [AuthGuard] },
  { path: 'Ledgerlist', component: LedgerlistComponent, canActivate: [AuthGuard] },
  { path: 'PPOBlist', component: PpoblistComponent, canActivate: [AuthGuard] },
  { path: 'PPOB/:id', component: PpobComponent, canActivate: [AuthGuard] },
  { path: 'Taxledgerlist', component: TaxledgerComponent, canActivate: [AuthGuard] },


];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)

  ],
  exports: [RouterModule]
})
export class MastersRoutingModule { }