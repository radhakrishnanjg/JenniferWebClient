export interface Product {
    category: string;
    productID: number;
    productName: string;
    unitPrice: number;
    unitsInStock: number;
    discontinued: boolean;
}

export const products: any[] = [
    {
        productID: 1,
        productName: 'Chai',
        unitPrice: 18,
        unitsInStock: 39,
        discontinued: false,
        categoryName: 'Beverages',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 2,
        productName: 'Chang',
        unitPrice: 19,
        unitsInStock: 17,
        discontinued: false,
        categoryName: 'Beverages',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 3,
        productName: 'Aniseed Syrup',
        unitPrice: 10,
        unitsInStock: 13,
        discontinued: false,
        categoryName: 'Condiments',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 4,
        productName: 'Chef Anton`s Cajun Seasoning',
        unitPrice: 22,
        unitsInStock: 53,
        discontinued: false,
        categoryName: 'Pastry',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 5,
        productName: 'Chef Anton`s Gumbo Mix',
        unitPrice: 21.35,
        unitsInStock: 0,
        discontinued: true,
        categoryName: 'Spices',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 6,
        productName: 'Grandma`s Boysenberry Spread',
        unitPrice: 25,
        unitsInStock: 120,
        discontinued: false,
        categoryName: 'Pastry',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 7,
        productName: 'Uncle Bob`s Organic Dried Pears',
        unitPrice: 30,
        unitsInStock: 15,
        discontinued: false,
        categoryName: 'Pastry',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 8,
        productName: 'Northwoods Cranberry Sauce',
        unitPrice: 40,
        unitsInStock: 6,
        discontinued: false,
        categoryName: 'Condiments',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 9,
        productName: 'Mishi Kobe Niku',
        unitPrice: 97,
        unitsInStock: 29,
        discontinued: true,
        categoryName: 'Meat/Poultry',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
    {
        productID: 10,
        productName: 'Ikura',
        unitPrice: 31,
        unitsInStock: 31,
        discontinued: false,
        categoryName: 'Seafood',
        ImagePath:"https://wardoc.jennifer-in.com/UploadFiles/Item/B004LLHEE4.jpg",
        ItemCode:"B004LLHEE4"
    },
     
];