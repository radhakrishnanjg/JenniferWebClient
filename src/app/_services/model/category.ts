export class Marketplace { 
    MarketplaceID: number;
    MarketPlace: string; 
    LoginId: number;
    IsActive:Boolean;
}

export class Brand {
    BrandID: number;
    CompanyId: number;
    BrandName: string;
    IsActive: Boolean;
    // who is doing this action
    LoginId: number;

}
export class ProductGroup {
    ProductGroupID: number;
    CompanyId: number;
    ProductGroupName: string;
    IsActive: Boolean;
    // who is doing this action
    LoginId: number;
}

export class Category {
    CategoryID: number;
    CompanyId: number;
    ProductGroupID: number;
    CategoryName: string;
    IsActive: Boolean;
    // who is doing this action
    LoginId: number;
    ProductGroupName: string;
}

export class SubCategory {
    SubCategoryID: number;
    CompanyId: number;
    CategoryID: number;
    SubCategoryName: string;
    IsActive: Boolean;
    //master table values 
    ProductGroupName: string;
    CategoryName: string;
    // who is doing this action
    LoginId: number;
}

export class UOM {
    UOMID: number;
    CompanyId: number;
    UOM: string;
    Description: string;
    MultiplierValue: number;
    IsActive: Boolean;
    LoginId: number
}


