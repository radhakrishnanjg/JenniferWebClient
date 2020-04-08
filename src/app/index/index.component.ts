import { Component, OnInit } from '@angular/core'; 
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { GeneralsupportService } from '../_services/service/generalsupport.service';
import { Generalsupport } from '../_services/model/generalsupport'; 
declare var $;


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  obj: Generalsupport = {} as any;
  Generalsupportform: FormGroup;
  captchaLength: number = 0;
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
  resolved(captchaResponse: string) {
   // console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaLength = `${captchaResponse}`.length;
  }

  constructor(
    private _generalsupportService: GeneralsupportService,
    private alertService: ToastrService,
    private fb: FormBuilder, 
  ) {

  }
  formErrors = {

    'Name': '',
    'Email': '',
    'MobileNumber': '',
    'Message': '',

  };

  validationMessages = {

    'Name': {
      'required': 'This field is required.',

    },
    'Email': {
      'required': 'This field is required.',
      'pattern': 'Email should be valid one'
    },

    'MobileNumber': {
      'required': 'This field is required.',

    },
    'Message': {
      'required': 'This field is required.',

    },


  };

  logValidationErrors(group: FormGroup = this.Generalsupportform): void {
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

    this.Generalsupportform = this.fb.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      MobileNumber: ['', [Validators.required]],
      Message: ['', [Validators.required]],
    });

    this.Animation();
    this.LandingScroll();


  }

  Animation() {
    let i = 0,
      a = 0,
      isBackspacing = false,
      isParagraph = false;
    let textArray = [
      "Jennifer Complete",
    ];
    let colorClass = [
      "cc1",
      "cc2",
      "cc3"
    ];

    let speedForward = 100, //Typing Speed
      speedWait = 1000, // Wait between typing and backspacing
      speedBetweenLines = 1000, //Wait between first and second lines
      speedBackspace = 25; //Backspace Speed

    //Run the loop
    typeWriter("output", textArray);

    function typeWriter(id, ar) {
      let element = $("#" + id),
        aString = ar[a],
        eHeader = element.children("b"), //Header element
        eParagraph = element.children("p"); //Subheader element


      if (!isBackspacing) {
        if (i < aString.length) {
          if (aString.charAt(i) == "|") {
            isParagraph = true;
            eHeader.removeClass("cursor");
            eParagraph.addClass("cursor");

            i++;
            setTimeout(function () { typeWriter(id, ar); }, speedBetweenLines);
          } else {
            if (!isParagraph) {
              eHeader.text(eHeader.text() + aString.charAt(i));

            } else {
              eParagraph.text(eParagraph.text() + aString.charAt(i));
            }

            i++;
            setTimeout(function () { typeWriter(id, ar); }, speedForward);
          }
        } else if (i == aString.length) {

          isBackspacing = true;
          setTimeout(function () { typeWriter(id, ar); }, speedWait);

        }
      } else {
        if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
          if (eParagraph.text().length > 0) {
            eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
          } else if (eHeader.text().length > 0) {
            eParagraph.removeClass("cursor");

            eHeader.attr('class', `cursor`);
            eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
          }
          setTimeout(function () { typeWriter(id, ar); }, speedBackspace);
        } else {

          isBackspacing = false;
          i = 0;
          isParagraph = false;
          a = (a + 1) % ar.length;
          let xba = Math.floor((Math.random() * 3) + 0);
          eHeader.attr('class', 'cursor ' + colorClass[xba]);
          setTimeout(function () { typeWriter(id, ar); }, 50);

        }
      }
    }

  }

  LandingScroll() {
    $(document).ready(function () {
      let scroll_link = $('.scroll');
      scroll_link.click(function (e) {
        e.preventDefault();
        let url = $('body').find($(this).attr('href')).offset().top;
        $('html, body').animate({
          scrollTop: url
        }, 700);
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
        return false;
      });
      $('.customer-logos').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
          breakpoint: 768,
          settings: {
            slidesToShow: 4
          }
        }, {
          breakpoint: 520,
          settings: {
            slidesToShow: 3
          }
        }]
      });
    });
  }


  SaveData() {
    this.obj.Name = this.Generalsupportform.controls['Name'].value;
    this.obj.Email = this.Generalsupportform.controls['Email'].value;
    this.obj.MobileNumber = this.Generalsupportform.controls['MobileNumber'].value;
    this.obj.Message = this.Generalsupportform.controls['Message'].value;

    this._generalsupportService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this.Generalsupportform.reset();
        }
        else {
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  Reset() {
    this.Generalsupportform.reset();
  }

}
