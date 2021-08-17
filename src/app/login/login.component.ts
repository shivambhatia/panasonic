import { Component, OnInit ,ChangeDetectorRef, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
// import { Console } from 'node:console';
declare var $: any;
import { AuthenticationService } from '../_services/authentication.service';
// import { Console } from 'node:console';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    formOtp:FormGroup;
    loading = false;
    submitted = false;
    mobile :string ;
    otpValue:string;
    returnUrl: string;
    message :string ;
    message_1:any=[];
    message_3:any = [];
    result :any;
    login = true;
  otp = false;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authentication: AuthenticationService,
        ) {

    this.message='';
    this.mobile='';
    this.returnUrl='';
    this.result='';
   




         }

  ngOnInit(): void {
        let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if(users.success){
             this.router.navigate(['/appointment']);
        }
        this.form = this.formBuilder.group({
            // mobile: ['', Validators.required],
            mobile:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            
        });
          this.formOtp = this.formBuilder.group({
            otpValue: ['', Validators.required],
            
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['otp'] || '/';


    $(document).ready(function() {	
      setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222')
      }, 3000);

    });
  }
  get f() { return this.form.controls; }
  get f2() { return this.formOtp.controls; }
  
    onSubmit() {
        this.submitted = true;
// console.log(this.form.value)
        // reset alerts on submit
       

        // stop here if form is invalid
        
         if(this.form.value.mobile == ""){


          this.message_1 = "Please enter mobile number"
          $("#err1").show();
          setTimeout(function(){
              $("#err1").hide();
            }, 5000);
          return;

          }
         
        else if (this.form.invalid) {
          return;

  }

        this.loading = true;
        this.authentication.login(this.f.mobile.value).pipe(first())
            .subscribe((data:any) => {
              this.mobile=this.f.mobile.value;
                    //debugger
                    //this.router.navigate('/otp',queryParams:{mobile:this.f.mobile.value,otp:data.otp})
                  //  console.log("Data New",data);
                   this.login=false;
                   this.otp=true;
                },
                error => {
                    // console.log("Error",error);
                    this.loading = false;
                });
      }





      onOtpSubmit(){
         if($('#otp').val( ) == ""){
          // console.log("hii3",($('#otp').val( ) == ""))
          this.message_3 = "Please enter OTP"
          
        $("#err3").show();
        setTimeout(function(){
            $("#err3").hide();
          }, 5000);
        return;
        }
        // console.log("Checking this otp",this.f2.otpValue.value);
        // console.log("Checking this mobile",this.mobile);
        
        this.authentication.verifyOtp(this.f2.otpValue.value,this.mobile).pipe(first())
            .subscribe((data:any) => {
              
                    //debugger
                    //this.router.navigate('/otp',queryParams:{mobile:this.f.mobile.value,otp:data.otp})
                  //  console.log("Data New Otp",data);
                   // this.login=false;
                   // this.otp=true;
                },
                error => {
                    // console.log("Error",error);
                    this.loading = false;
                });

      }

      

}
