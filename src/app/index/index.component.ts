import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  captchaForm: FormGroup;
  captchaLength: number = 0;
  Year:number=0;
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaLength = `${captchaResponse}`.length;
  }

  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
  ) { }

  formErrors = {
    'Name': '',
    'PhoneNumber': '',
    'Email': '',
  };
  validationMessages = {
    'Name': {
      'required': 'This field is required.',
    },
    'PhoneNumber': {
      'required': 'This field is required.',
    },
    'Email': {
      'required': 'This field is required',
    },
  };

  logValidationErrors(group: FormGroup = this.captchaForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  ngOnInit() {
    this.Year= new Date().getFullYear();
    this.captchaForm = this.fb.group({
      Name: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      Email: ['', [Validators.required]], 
    });

    // $("#slideshow > div:gt(0)").hide();

    // setInterval(function () {
    //   $('#slideshow > div:first')
    //     .fadeOut(1000)
    //     .next()
    //     .fadeIn(1000)
    //     .end()
    //     .appendTo('#slideshow');
    // }, 3000);

    // $(window).scroll(function () {
    //   if ($(this).scrollTop()) {
    //     $('#toTop').fadeIn();
    //   } else {
    //     $('#toTop').fadeOut();
    //   }
    // });

    // $("#toTop").click(function () {
    //   $("html, body").animate({ scrollTop: 0 }, 1000);
    // });
    // // 
    // function myFunction() {
    //   var x = document.getElementById("myTopnav");
    //   if (x.className === "topnav") {
    //     x.className += " responsive";
    //   } else {
    //     x.className = "topnav";
    //   }
    // }
    // // 
    // $(window).scroll(function () {
    //   var sticky = $('.sticky'),
    //     scroll = $(window).scrollTop();

    //   if (scroll >= 100) sticky.addClass('fixed');
    //   else sticky.removeClass('fixed');
    // });
 

    // this.scroll();

  } 
  scroll() {
    document.querySelector('#target').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  SaveData() {
    this.captchaForm.reset();
    this.alertService.success('Your details are successfully submitted in our system, Please wait for the response.');
  }

}
