import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
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
  constructor(private http: HttpClient,  private authentication: AuthenticationService,) { }

  ngOnInit(): void {
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userData=users;

        this.name.setValue(this.userData.result.name);
        this.email.setValue(this.userData.result.email);

    //debugger;
    console.log(this.userData)
  }
  updateProfile(){
    var regex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(this.email.value == ""){
      this.message_2 = "Email is required"
      $("#err2").show();
      setTimeout(function(){
          $("#err2").hide();
        }, 3000);
      return;

    }
    else if(this.name.value ==""){
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
    else{
      const headers = { 'Authorization': 'Bearer '+this.userData.token}
      console.log(headers);
      var data={"id":this.userData.result.id,"name":this.name.value,"email":this.email.value};
      console.log(data);
      let resp=this.http.post('http://65.1.176.15:5050/apis/updateCustomer',data, { headers: headers});
     
      resp.subscribe((result:any)=>{   
        console.log(result,"updated") 
          if(result.success == true){
            
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
