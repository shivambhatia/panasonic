import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/users';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { formatDate } from '@angular/common';
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
   providers: [DatePipe]
})
export class AppointmentComponent implements OnInit {
  count= '1';
  selectedServices:string [];  
  data : any;
  private token : string;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  appointment: any;
  myDate = new Date();
  tempDate:number;
  currentAppointment:any[];
  upcomingAppointment:any[];
  pastAppointment:any[];
  blank :any;
  constructor(private http: HttpClient,private datePipe: DatePipe,private router: Router) {    
    
    this.selectedServices=[];
    
    this.tempDate=parseInt(formatDate(this.myDate, 'yyyyMMddhh','En-Us'));
   
    this.pastAppointment=[];
    this.currentAppointment=[];
    this.upcomingAppointment=[];
    this.blank=false;
    

    
       //this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if(!users.success){
      this.router.navigate([''])
    }
    const headers = { 'Authorization': 'Bearer '+users.token }
    
    
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getCustomerAppointments',{"id":users.result.id}, { headers: headers});
    
    //resp.subscribe((result)=>this.users=result);
    this.selectedServices=new Array<string>();
    resp.subscribe((result)=>{    
      this.data=result
      this.appointment = this.data.result
      if(this.appointment.length==0){
        this.blank=true;
      }
   
      if(this.data.status){
        this.data.result.map((item:any)=>{

            let temp=item.appointment_date.replaceAll('-','')+item.appointment_time.split('-')[0].split(':')[0];
            console.log(temp);
            console.log("Current",this.tempDate);
            item.serviceNames=JSON.parse(item.serviceNames).join(",");
            
            
            
            if(temp<this.tempDate){
              
              this.pastAppointment.push(item);

            }
            else if(temp>this.tempDate){
              
              this.upcomingAppointment.push(item);
            }

            else if(temp==this.tempDate){

              this.currentAppointment.push(item);
              
            }

        });
        

      }    
      console.log("Step 1",this.currentAppointment);
    })
   
    
  }
  
  

  getSelectedServiceId(e:any,id:string){

    if(e.target.checked){
      
      this.selectedServices.push(id);
    }

    else{
      console.log("Unchecked",id);
    }
    console.log("Checking all the data",this.selectedServices);
  } 

}
