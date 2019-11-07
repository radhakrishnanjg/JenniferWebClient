//const form_template =
// [
//   {
//     "ControlId": "Control1",
//     "ControlType": "TextBox",
//     "ControlSize": "medium",
//     "Caption": "Full Name",
//     "IsMandantory": true,
//     "MandantoryErrorMessage": "Full Name is required",
//     "MaxLengthValue": 10,
//     "ExampleValue": "Radhakrishnan J",
//   },
//   {
//     "ControlId": "Control2",
//     "ControlType": "Number",
//     "ControlSize": "small",
//     "Caption": "Age",
//     "IsMandantory": false,
//     "MinValue": 0,
//     "MaxValue": 100,
//     "ExampleValue": "25",
//   },
//   {
//     "ControlId": "Control3",
//     "ControlType": "TextArea",
//     "ControlSize": "nosize",
//     "Caption": "Remarks",
//     "IsMandantory": false,
//     "MaxLengthValue": 5000,
//     "ExampleValue": "Descripe what you want to do",
//   },
//   {
//     "ControlId": "Control4",
//     "ControlType": "DropDown",
//     "DropDownType": "Static",
//     "ControlSize": "large",
//     "Caption": "Favorite Book",
//     "Options": [ 
//     { 
//       "name":"Two-Wheeler"
//    },
//    { 
//       "name":"Four-Wheeler"
//    },
//    { 
//       "name":"Truck"
//    },
//    { 
//       "name":"Others"
//    }
// ],
//     "IsMandantory": true,
//     "MandantoryErrorMessage": "Please select Favorite Book",
//   },
//   {
//     "ControlId": "Control5",
//     "ControlType": "DropDown",
//     "ControlSize": "large",
//     "DropDownType": "Dynamic",
//     "Caption": "State",
//     "Options": [
//       { name: "Tamil Nadu", value: "1" },
//       { name: "Karnataka", value: "2", },
//     ],
//     "IsMandantory": true,
//     "MandantoryErrorMessage": "This Field is required",
//   },
//   {
//     "ControlId": "Control6",
//     "ControlType": "CheckBox",
//     "Caption": "Is Event Date",
//     "Options": ["1"],
//     "IsMandantory": false, 
//   },

//   // {
//   //   "ControlId": "Control5",
//   //   "ControlType": "chechboxlist",
//   //   "label": "Area of Interest",
//   //   "options": ["C#","Java","Angular","HTML"],
//   //   "IsMandantory": true,
//   // }
// ]
const form_template =
[ 
   { 
      "ControlId":"Vehicle_Number",
      "ControlType":"TextBox",
      "ControlSize":"medium",
      "Caption":"Vehicle Number",
      "ExampleValue":"KA 01 HX 1642",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":20
   },
   { 
      "ControlId":"Drive_Name",
      "ControlType":"TextBox",
      "ControlSize":"small",
      "Caption":"Drive Name",
      "ExampleValue":"Radha Krishnan",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":40
   },
   { 
      "ControlId":"Drive_Age",
      "ControlType":"Number",
      "ControlSize":"x-small",
      "Caption":"Drive Age",
      "ExampleValue":"30",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":3,
      "MinValue":18,
      "MaxValue":100
   },
   { 
      "ControlId":"Vehicle_Type",
      "ControlType":"DropDown",
      "ControlSize":"medium",
      "Caption":"Vehicle Type",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":30,
      "DropDownType":"Static",
      "Options":[ 
         { 
            "name":"Two-Wheeler"
         },
         { 
            "name":"Four-Wheeler"
         },
         { 
            "name":"Truck"
         },
         { 
            "name":"Others"
         }
      ]
   },
   { 
      "ControlId":"State",
      "ControlType":"DropDown",
      "ControlSize":"medium",
      "Caption":"State",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":30,
      "DropDownType":"Dynamic",
      "Options":[ 
         { 
            "name":"[{\"name\":\"ANDHRA PRADESH\""
         },
         { 
            "name":"\"value\":1}"
         },
         { 
            "name":"{\"name\":\"ARUNACHAL PRADESH\""
         },
         { 
            "name":"\"value\":2}"
         },
         { 
            "name":"{\"name\":\"ASSAM\""
         },
         { 
            "name":"\"value\":3}"
         },
         { 
            "name":"{\"name\":\"BIHAR\""
         },
         { 
            "name":"\"value\":4}"
         },
         { 
            "name":"{\"name\":\"CHHATTISGARH\""
         },
         { 
            "name":"\"value\":5}"
         },
         { 
            "name":"{\"name\":\"GOA\""
         },
         { 
            "name":"\"value\":6}"
         },
         { 
            "name":"{\"name\":\"GUJARAT\""
         },
         { 
            "name":"\"value\":7}"
         },
         { 
            "name":"{\"name\":\"HARYANA\""
         },
         { 
            "name":"\"value\":8}"
         },
         { 
            "name":"{\"name\":\"HIMACHAL PRADESH\""
         },
         { 
            "name":"\"value\":9}"
         },
         { 
            "name":"{\"name\":\"JAMMU & KASHMIR\""
         },
         { 
            "name":"\"value\":10}"
         },
         { 
            "name":"{\"name\":\"JHARKHAND\""
         },
         { 
            "name":"\"value\":11}"
         },
         { 
            "name":"{\"name\":\"KARNATAKA\""
         },
         { 
            "name":"\"value\":12}"
         },
         { 
            "name":"{\"name\":\"KERALA\""
         },
         { 
            "name":"\"value\":13}"
         },
         { 
            "name":"{\"name\":\"MADHYA PRADESH\""
         },
         { 
            "name":"\"value\":14}"
         },
         { 
            "name":"{\"name\":\"MAHARASHTRA\""
         },
         { 
            "name":"\"value\":15}"
         },
         { 
            "name":"{\"name\":\"Manipur\""
         },
         { 
            "name":"\"value\":16}"
         },
         { 
            "name":"{\"name\":\"MEGHALAYA\""
         },
         { 
            "name":"\"value\":17}"
         },
         { 
            "name":"{\"name\":\"MIZORAM\""
         },
         { 
            "name":"\"value\":18}"
         },
         { 
            "name":"{\"name\":\"NAGALAND\""
         },
         { 
            "name":"\"value\":19}"
         },
         { 
            "name":"{\"name\":\"ODISHA\""
         },
         { 
            "name":"\"value\":20}"
         },
         { 
            "name":"{\"name\":\"PUNJAB\""
         },
         { 
            "name":"\"value\":21}"
         },
         { 
            "name":"{\"name\":\"RAJASTHAN\""
         },
         { 
            "name":"\"value\":22}"
         },
         { 
            "name":"{\"name\":\"SIKKIM\""
         },
         { 
            "name":"\"value\":23}"
         },
         { 
            "name":"{\"name\":\"TAMIL NADU\""
         },
         { 
            "name":"\"value\":24}"
         },
         { 
            "name":"{\"name\":\"TELANGANA\""
         },
         { 
            "name":"\"value\":25}"
         },
         { 
            "name":"{\"name\":\"Tripura\""
         },
         { 
            "name":"\"value\":26}"
         },
         { 
            "name":"{\"name\":\"UTTAR PRADESH\""
         },
         { 
            "name":"\"value\":27}"
         },
         { 
            "name":"{\"name\":\"UTTARAKHAND\""
         },
         { 
            "name":"\"value\":28}"
         },
         { 
            "name":"{\"name\":\"WEST BENGAL\""
         },
         { 
            "name":"\"value\":29}"
         },
         { 
            "name":"{\"name\":\"Singapore\""
         },
         { 
            "name":"\"value\":30}"
         },
         { 
            "name":"{\"name\":\"DELHI\""
         },
         { 
            "name":"\"value\":31}"
         },
         { 
            "name":"{\"name\":\"ANDAMAN & NICOBAR ISLANDS\""
         },
         { 
            "name":"\"value\":32}"
         },
         { 
            "name":"{\"name\":\"CHANDIGARH\""
         },
         { 
            "name":"\"value\":33}"
         },
         { 
            "name":"{\"name\":\"DADRA & NAGAR HAVELI\""
         },
         { 
            "name":"\"value\":34}"
         },
         { 
            "name":"{\"name\":\"DAMAN & DIU\""
         },
         { 
            "name":"\"value\":35}"
         },
         { 
            "name":"{\"name\":\"PUDUCHERRY\""
         },
         { 
            "name":"\"value\":36}"
         },
         { 
            "name":"{\"name\":\"LAKSHADWEEP\""
         },
         { 
            "name":"\"value\":37}]"
         }
      ]
   },
   { 
      "ControlId":"Dropdown_2",
      "ControlType":"DropDown",
      "ControlSize":"medium",
      "Caption":"Dropdown 2",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":30,
      "DropDownType":"Dynamic",
      "Options":[ 
         { 
            "name":"[{\"name\":\"ANDHRA PRADESH\""
         },
         { 
            "name":"\"value\":1}"
         },
         { 
            "name":"{\"name\":\"ARUNACHAL PRADESH\""
         },
         { 
            "name":"\"value\":2}"
         },
         { 
            "name":"{\"name\":\"ASSAM\""
         },
         { 
            "name":"\"value\":3}"
         },
         { 
            "name":"{\"name\":\"BIHAR\""
         },
         { 
            "name":"\"value\":4}"
         },
         { 
            "name":"{\"name\":\"CHHATTISGARH\""
         },
         { 
            "name":"\"value\":5}"
         },
         { 
            "name":"{\"name\":\"GOA\""
         },
         { 
            "name":"\"value\":6}"
         },
         { 
            "name":"{\"name\":\"GUJARAT\""
         },
         { 
            "name":"\"value\":7}"
         },
         { 
            "name":"{\"name\":\"HARYANA\""
         },
         { 
            "name":"\"value\":8}"
         },
         { 
            "name":"{\"name\":\"HIMACHAL PRADESH\""
         },
         { 
            "name":"\"value\":9}"
         },
         { 
            "name":"{\"name\":\"JAMMU & KASHMIR\""
         },
         { 
            "name":"\"value\":10}"
         },
         { 
            "name":"{\"name\":\"JHARKHAND\""
         },
         { 
            "name":"\"value\":11}"
         },
         { 
            "name":"{\"name\":\"KARNATAKA\""
         },
         { 
            "name":"\"value\":12}"
         },
         { 
            "name":"{\"name\":\"KERALA\""
         },
         { 
            "name":"\"value\":13}"
         },
         { 
            "name":"{\"name\":\"MADHYA PRADESH\""
         },
         { 
            "name":"\"value\":14}"
         },
         { 
            "name":"{\"name\":\"MAHARASHTRA\""
         },
         { 
            "name":"\"value\":15}"
         },
         { 
            "name":"{\"name\":\"Manipur\""
         },
         { 
            "name":"\"value\":16}"
         },
         { 
            "name":"{\"name\":\"MEGHALAYA\""
         },
         { 
            "name":"\"value\":17}"
         },
         { 
            "name":"{\"name\":\"MIZORAM\""
         },
         { 
            "name":"\"value\":18}"
         },
         { 
            "name":"{\"name\":\"NAGALAND\""
         },
         { 
            "name":"\"value\":19}"
         },
         { 
            "name":"{\"name\":\"ODISHA\""
         },
         { 
            "name":"\"value\":20}"
         },
         { 
            "name":"{\"name\":\"PUNJAB\""
         },
         { 
            "name":"\"value\":21}"
         },
         { 
            "name":"{\"name\":\"RAJASTHAN\""
         },
         { 
            "name":"\"value\":22}"
         },
         { 
            "name":"{\"name\":\"SIKKIM\""
         },
         { 
            "name":"\"value\":23}"
         },
         { 
            "name":"{\"name\":\"TAMIL NADU\""
         },
         { 
            "name":"\"value\":24}"
         },
         { 
            "name":"{\"name\":\"TELANGANA\""
         },
         { 
            "name":"\"value\":25}"
         },
         { 
            "name":"{\"name\":\"Tripura\""
         },
         { 
            "name":"\"value\":26}"
         },
         { 
            "name":"{\"name\":\"UTTAR PRADESH\""
         },
         { 
            "name":"\"value\":27}"
         },
         { 
            "name":"{\"name\":\"UTTARAKHAND\""
         },
         { 
            "name":"\"value\":28}"
         },
         { 
            "name":"{\"name\":\"WEST BENGAL\""
         },
         { 
            "name":"\"value\":29}"
         },
         { 
            "name":"{\"name\":\"Singapore\""
         },
         { 
            "name":"\"value\":30}"
         },
         { 
            "name":"{\"name\":\"DELHI\""
         },
         { 
            "name":"\"value\":31}"
         },
         { 
            "name":"{\"name\":\"ANDAMAN & NICOBAR ISLANDS\""
         },
         { 
            "name":"\"value\":32}"
         },
         { 
            "name":"{\"name\":\"CHANDIGARH\""
         },
         { 
            "name":"\"value\":33}"
         },
         { 
            "name":"{\"name\":\"DADRA & NAGAR HAVELI\""
         },
         { 
            "name":"\"value\":34}"
         },
         { 
            "name":"{\"name\":\"DAMAN & DIU\""
         },
         { 
            "name":"\"value\":35}"
         },
         { 
            "name":"{\"name\":\"PUDUCHERRY\""
         },
         { 
            "name":"\"value\":36}"
         },
         { 
            "name":"{\"name\":\"LAKSHADWEEP\""
         },
         { 
            "name":"\"value\":37}]"
         }
      ]
   },
   { 
      "ControlId":"Is_Visited_Before",
      "ControlType":"CheckBox",
      "Caption":"Is Visited Before",
      "MandantoryErrorMessage":"This Field is Required"
   },
   { 
      "ControlId":"Remarks",
      "ControlType":"TextArea",
      "ControlSize":"nosize",
      "Caption":"Remarks",
      "ExampleValue":"Enter Remarks",
      "IsMandantory":false,
      "MandantoryErrorMessage":"This Field is Required",
      "MaxLengthValue":8000
   }
]
export default form_template 