import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/users';
import {ActivatedRoute} from '@angular/router';

import { formatDate } from '@angular/common';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  appointment: any;
  myDate = new Date();
  //tempDate:string;
  data:any;
  title:string;
  detail:any [];
  daysLeft:Number;
  constructor(private http: HttpClient,private router: ActivatedRoute) { 
    //this.tempDate=formatDate(this.myDate, 'dd/MM/yyyy','En-Us');
         //console.log(this.router.getCurrentNavigation().extras.state.example);
  }

  ngOnInit(): void {
    console.log(this.router.snapshot.params.id);
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = { 'Authorization': 'Bearer '+users.token }
    
    this.detail=new Array<string>();
    let resp=this.http.post('http://65.1.176.15:5050/apis/getCustomerAppointments',{"id":1}, { headers: headers});
    resp.subscribe((result)=>{    
      this.data=result
      this.appointment = this.data.result
      if(this.data.status){
        
          this.detail=this.appointment.filter((item:any)=>item.id==this.router.snapshot.params.id);
          
          //let appointment_date=Date(this.detail[0].appointment_date);
          
          let dateString = formatDate(this.detail[0].appointment_date,'yyyy/MM/dd','En-US');
          
          let newDate = new Date(dateString);
          if(newDate>this.myDate){
            this.title="UPCOMING"

          }
          else if(newDate<this.myDate){
          this.title="PAST"

          }
          
          else{
            this.title="CURRENT"
          }
         

         

      }


      
    })
  }

}
