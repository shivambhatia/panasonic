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
    wa_checked :any=[];
    otpValue:string;
    returnUrl: string;
    message :string ;
    message_1:any=[];
    message_3:any = [];
    result :any;
    login = true;
    valid:any =[];
    invalid:any =[];
    whatsapp:any=[]
    resend_otp:any = [];
    policies:any=[];
    terms:any=[]
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
        console.log(users,"user")
        if(users.success){
             this.router.navigate(['/appointment']);
        }
        this.form = this.formBuilder.group({
            // mobile: ['', Validators.required],
            mobile:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            whatsapp:['']
            
        });
          this.formOtp = this.formBuilder.group({
            otpValue: ['', Validators.required],
            
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['otp'] || '/';
        this.authentication.termsCondition().pipe(first())
        .subscribe((data:any) => {
          console.log(data)
          this.policies = data.result.privacypolicy;
          this.terms = data.result.privacypolicy_terms;
          
        })


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
        console.log(this.f.whatsapp.value,"PPP")
        if(this.f.whatsapp.value == true){
          // this.wa_checked ==  1;
          this.whatsapp = { wa_checked : "1"}
          // console.log(this.whatsapp)
        }
        else{
          // this.wa_checked == 0
          this.whatsapp = { wa_checked : "0"}
        }
        console.log(this.whatsapp)
       
        this.authentication.login(this.f.mobile.value, this.whatsapp).pipe(first())
            .subscribe((data:any) => {
              this.mobile=this.f.mobile.value;
                    //debugger
                    //this.router.navigate('/otp',queryParams:{mobile:this.f.mobile.value,otp:data.otp})
                  //  console.log("Data New",data);
                   this.login=false;
                   this.otp=true;
                   this.login=false;
                   this.otp=true;
                   var timer2 = "0:60";
                  var interval = setInterval(function() {
                    var timer = timer2.split(':');
                    var minutes = parseInt(timer[0], 10);
                    let seconds:any = parseInt(timer[1], 10);
                    --seconds;
                    minutes = (seconds < 0) ? --minutes : minutes;
                    if (minutes < 0) clearInterval(interval);
                    seconds = (seconds < 0) ? 59 : seconds;
                    seconds = (seconds < 10) ? '0' + seconds : seconds;
                    $('.countdown').html(minutes + ':' + seconds);
                    timer2 = minutes + ':' + seconds;
                    if(timer2 == "-1:59"){
                    $('.count').hide();
                    $('.countdown').html("");
                    $('.ten1').show();
                    }
                  }, 1000);
                },
                error => {
                    // console.log("Error",error);
                    this.loading = false;
                });
      }



      
      resendOtp(){
        this.resend_otp = "OTP has been resend"
        console.log("Step 1",this.mobile);
        console.log("Step 2",this.message);
          
        $("#resend_otp").show();
        setTimeout(function(){
            $("#resend_otp").hide();
          }, 5000);
          this.authentication.login(this.f.mobile.value,this.whatsapp).pipe(first())
          .subscribe((data:any) => {
            this.mobile=this.f.mobile.value;
            this.login=false;
            this.otp=true;
            var timer2 = "0:60";
            $('.ten1').hide();
            $('.count').show();
           var interval = setInterval(function() {
             var timer = timer2.split(':');
             var minutes = parseInt(timer[0], 10);
             let seconds:any = parseInt(timer[1], 10);
             --seconds;
             minutes = (seconds < 0) ? --minutes : minutes;
             if (minutes < 0) clearInterval(interval);
             seconds = (seconds < 0) ? 59 : seconds;
             seconds = (seconds < 10) ? '0' + seconds : seconds;
             $('.countdown').html(minutes + ':' + seconds);
             timer2 = minutes + ':' + seconds;
             if(timer2 == "-1:59"){
             $('.count').hide();
             $('.countdown').html("");
             $('.ten1').show();
             }
           }, 1000);
                  //debugger
                  //this.router.navigate('/otp',queryParams:{mobile:this.f.mobile.value,otp:data.otp})
             
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
          }, 3000);
        return;
        }
        // console.log("Checking this otp",this.f2.otpValue.value);
        // console.log("Checking this mobile",this.mobile);
        
        this.authentication.verifyOtp(this.f2.otpValue.value,this.mobile).pipe(first())
            .subscribe((data:any) => {
              console.log(data,"otp response")
              if(data.success == true){
                this.valid = "SUCCESSFULLY VERIFIED"
                $("#err_valid").css("display", "block");
                setTimeout(function(){
                  $("#err_valid").hide();
        
                }, 3000);
              }
              else{
                this.invalid = "INVALID OTP";
                $("#err_invalid").css("display", "block");
                setTimeout(function(){
                  $("#err_invalid").hide();
        
                }, 3000);
              }
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
      login_page(){
        // $("#login_div").attr("style", "display: inline !important");
        // $("#otp_div").attr("style", "display: none !important");
        
        this.login=true;
                   this.otp=false;
                   
                   this.f2.otpValue.setValue(''); 
                   $("#err3").hide();
                   $("#err_valid").hide();
                   $("#err_invalid").hide();
                  
        
      }

      

}
