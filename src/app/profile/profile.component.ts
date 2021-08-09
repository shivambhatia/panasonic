import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  title = 'My Profile';
  userData:any;
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
       const headers = { 'Authorization': 'Bearer '+this.userData.token}
    console.log(headers);
    var data={"id":this.userData.result.id,"name":this.name.value,"email":this.email.value};
    console.log(data);
    let resp=this.http.post('http://65.1.176.15:5050/apis/updateCustomer',data, { headers: headers});
   
    resp.subscribe((result:any)=>{    
        this.userData.result.name=result.result.name;
        this.userData.result.email=result.result.email;
        localStorage.setItem('currentUser', JSON.stringify(this.userData));
        
        this.name.setValue(result.result.name);
        this.email.setValue(result.result.email);
          
    })
  }
  getAllValues(){


    this.updateProfile();
     
  }
  callLogout(){
    //console.log("step 2");
    this.authentication.logout();

  }

}
