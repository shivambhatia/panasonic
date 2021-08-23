import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  title = 'My Profile';
  userData:any;
  message_1:any;
  message_2:any;
  message_3:any;
  message_8:any;
  name = new FormControl('', [Validators.required, Validators.maxLength(40)]);
  email = new FormControl('', Validators.required); 
  //phone = new FormControl('', Validators.required); 
  constructor(private http: HttpClient,  private authentication: AuthenticationService,private router: Router) { }

  ngOnInit(): void {
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!users.success){
      this.router.navigate(['']);
    }
    
    this.userData=users;
console.log(this.userData)
        this.name.setValue(this.userData.result.name);
        this.email.setValue(this.userData.result.email);
        if(this.userData.result.name!== null || this.userData.result.email!== null){
          $('#name').prop("disabled", true);
          $('#email').prop("disabled", true);
        }
        else{
          $('#name').prop("disabled", false);
          $('#email').prop("disabled", false);
        }

    //debugger;
    console.log(this.userData)
  }
  edit(){
    $('#name').prop("disabled", false);
    $('#email').prop("disabled", false);
  }
  omit_special_char(event:any)
  {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  updateProfile(){
    var regex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regex_name=/^([a-zA-Z' ]+)$/;
    if(this.email.value == "" || this.email.value == null){
      this.message_2 = "Email is required"
      $("#err2").show();
      setTimeout(function(){
          $("#err2").hide();
        }, 3000);
      return;

    }
    else if(this.name.value =="" ||  this.name.value == null){
      this.message_3 = "Name is required"
      $("#err3").show();
      setTimeout(function(){
          $("#err3").hide();
        }, 3000);
      return;
    }
    else if(!regex.test(this.email.value)){
      this.message_8 = "Email must be a valid email address"
      $("#err8").show();
      setTimeout(function(){
          $("#err8").hide();
        }, 5000);
      return;

    }
    else if(!regex_name.test(this.name.value)){
      this.message_8 = "Name must be a valid and must contain space and alphabets only"
      $("#err8").show();
      setTimeout(function(){
          $("#err8").hide();
        }, 5000);
      return;

    }
    else{
      const headers = { 'Authorization': 'Bearer '+this.userData.token}
      console.log(headers);
      var data={"id":this.userData.result.id,"name":this.name.value,"email":this.email.value};
      console.log(data);
      let resp=this.http.post('http://65.1.176.15:5050/apis/updateCustomer',data, { headers: headers});
     
      resp.subscribe((result:any)=>{   
        console.log(result,"updated") 
          if(result.success == true){
            $('#name').prop("disabled", true);
            $('#email').prop("disabled", true);
            $('#UpdateModal').modal('show');
          }
        
          this.userData.result.name=result.result.name;
          this.userData.result.email=result.result.email;
          localStorage.setItem('currentUser', JSON.stringify(this.userData));
          
          this.name.setValue(result.result.name);
          this.email.setValue(result.result.email);
            
      })
    }
      
  } 
  confirm(){
    $('#UpdateModal').modal('hide');
  }
  getAllValues(){


    this.updateProfile();
     
  }
  callLogout(){
    //console.log("step 2");
    this.authentication.logout();

  }

}
