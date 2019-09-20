export class Apisettings {
        //File Validation
        public static KYCFiles_Ext: string[] = ["xls", "xlsx"];
        public static KYCFiles_Fileszie: number = 10; // mb

        public static IMGFiles_Ext: string[] = ["JPEG", "PNG", "JPG", "jpeg", "png", "jpg"];
        public static IMGFiles_Fileszie: number = 2; // mb

        public static PDFFiles_Ext: string[] = ["pdf", "PDF"];
        public static PDFFiles_Fileszie: number = 2; // mb

        //Regular expression 
        public static Regex_Numeric: "/^([0-9]+)$/";
        public static Regex_AlphaNumeric: "/^([a-zA-Z0-9 ]+)$/";
        public static Regex_Alpha: '"/^[a-zA-Z]*$/"'; //"/^[a-zA-Z\s]*$/"
        public static Regex_AlphaWithoutSpace: "/^([a-zA-Z]+)$/";
        public static Regex_Float: "/^((?=.*[1-9])\d{1,19}(?:\.\d{1,2})?)$/";
        public static Regex_NumericComma: "/^([0-9,.]+)$/";
        public static Regex_IndiaPincode: "/^\d{6,6}$/";
        public static Regex_Percentage: "/(100|[0-9]{1,2})(\.[0-9]{1,2})?/";
}
