const form_template =
[ 
   { 
      "ControlId":"Vehicle_Number",
      "ControlType":"TextBox",
      "ControlSize":"medium",
      "Caption":"Vehicle Number",
      "ExampleValue":"KA 01 HX 1642",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "MaxLengthValue":20,
      "Options":""
   },
   { 
      "ControlId":"Drive_Name",
      "ControlType":"TextBox",
      "ControlSize":"small",
      "Caption":"Drive Name",
      "ExampleValue":"Radha Krishnan",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "MaxLengthValue":40,
      "Options":""
   },
   { 
      "ControlId":"Drive_Age",
      "ControlType":"Number",
      "ControlSize":"x-small",
      "Caption":"Drive Age",
      "ExampleValue":"30",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "MaxLengthValue":3,
      "MinValue":18,
      "MaxValue":100,
      "Options":""
   },
   { 
      "ControlId":"Vehicle_Type",
      "ControlType":"DropDown",
      "ControlSize":"medium",
      "Caption":"Vehicle Type",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "MaxLengthValue":30,
      "DropDownType":"Static",
      "Options":""
   },
   { 
      "ControlId":"Is_Visited_Before",
      "ControlType":"CheckBox",
      "Caption":"Is Visited Before",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "Options":""
   },
   { 
      "ControlId":"Remarks",
      "ControlType":"TextArea",
      "ControlSize":"nosize",
      "Caption":"Remarks",
      "ExampleValue":"Enter Remarks",
      "IsMandantory":false,
      "MaxLengthValue":8000,
      "Options":""
   },
   { 
      "ControlId":"Country",
      "ControlType":"DropDown",
      "ControlSize":"medium",
      "Caption":"Country",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "MaxLengthValue":30,
      "DropDownType":"Dynamic",
      "Options":"",
      "HasChild":true,
      "ChildControlId":"State"
   },
   { 
      "ControlId":"State",
      "ControlType":"DropDown",
      "ControlSize":"medium",
      "Caption":"State",
      "IsMandantory":true,
      "MandantoryErrorMessage":"This Field is required.!",
      "MaxLengthValue":30,
      "DropDownType":"Dynamic",
      "Options":"",
      "HasChild":false,
      "ParentControlId":"Country"
   }
]
export default form_template 