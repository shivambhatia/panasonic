import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  public policies:any = [];
  public terms:any=[];
 
  userDataProfile:any=[];
  token:any=[];
  constructor(private http: HttpClient,private router: Router,private authentication: AuthenticationService) {
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(users.success){
      // debugger;
      this.userDataProfile=users.result;



        this.token = users.token; 
        console.log(this.token,"token")      
       
         
    }   
  else{
    this.router.navigate(['/login']);
  }
   }

  ngOnInit(): void {
    this.authentication.termsCondition().pipe(first())
        .subscribe((data:any) => {
          console.log(data)
          this.policies = data.result.privacypolicy;
          this.terms = data.result.privacypolicy_terms;
          
        })
    // const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    // console.log("Step 1",headers);
    // var parent=this;
    // let resp=this.http.post('http://65.1.176.15:5050/apis/getbookingdate',{}, { headers: headers});
    // //resp.subscribe((result)=>this.users=result);
    // // this.selectedServices=new Array<string>();
    // resp.subscribe((data:any)=>{  
    //   console.log(data," terms")  
    //   this.policies = data.result.privacypolicy;
    //   this.terms = data.result.privacypolicy_terms;
    //   // console.log(this.policies,this.terms)
           
      
    // })
  }

}
