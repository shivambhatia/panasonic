import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/users';
import {ActivatedRoute} from '@angular/router';
import {IAngularMyDpOptions, IMyDateModel, MM} from 'angular-mydatepicker';
declare var $: any;
import * as moment from 'moment';
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
  token :any =[];
  dataToken =  true;
  dataScan = true;
  dataButton =  true;
  users:any =[];
  allServices:any =[];
  final_result_2:any=[];
  tokenNo:any=[];
  constructor(private http: HttpClient,private router: ActivatedRoute) { 
    //this.tempDate=formatDate(this.myDate, 'dd/MM/yyyy','En-Us');
         //console.log(this.router.getCurrentNavigation().extras.state.example);
  }

  ngOnInit(): void {
    console.log(this.router.snapshot.params.id);
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log("Users data",users);
    this.users = users.result;
    const headers = { 'Authorization': 'Bearer '+users.token }
    this.token = users.token
    this.detail=new Array<string>();
    let resp=this.http.post('http://65.1.176.15:5050/apis/getCustomerAppointments',{"id":users.result.id}, { headers: headers});
    resp.subscribe((result)=>{    
      this.data=result
      this.appointment = this.data.result
      if(this.data.status){
        console.log(this.detail[0])
          this.detail=this.appointment.filter((item:any)=>item.id==this.router.snapshot.params.id);
          console.log(this.detail[0].token)
         
          //let appointment_date=Date(this.detail[0].appointment_date);
          var today =  moment().format('YYYY-MM-DD');
          // var appBookdate = bookedData.appointment_date;
          // var bookedData = data.booking_detail;
          var appBookdate =  this.detail[0].appointment_date;
          var d = new Date();
          var h =  d.getHours();
          var m = d.getMinutes();
          var currentTime = h + ":" + m
          var appBook_time = this.detail[0].appointment_time.split("-")[0];
         console.log(today>appBookdate)
          var regex = new RegExp(':', 'g');
          if(today > appBookdate)
          {
            
            // $('#footer-button').attr("style", "display: none !important");
            // $('#qr_code').addClass("d-none")
            // $('#footer-button').addClass("d-none")
            this.dataScan = false;
            this.dataButton = false;
          console.log("if")
           
          }
         
           
            // $('#footer-button').show();
            // $('#qr_code').show();
            // this.dataScan = true;
            // this.dataButton = true;
            else if(this.detail[0].token!== null){
              console.log("jjj")
              this.dataButton = false;
            this.tokenNo = this.detail[0].token.token_number
            this.dataToken = true;
          
            console.log(this.tokenNo,"tokenbbbbbbbb")
          }
  
            else{
             
              this.dataButton = true;
              this.dataScan = true;
              this.dataToken = false
            }
          
          console.log(this.detail[0].appointment_time.split('-')[0]);
          let dateString = formatDate(this.detail[0].appointment_date+' '+this.detail[0].appointment_time.split('-')[0],'yyyy/MM/dd %H:%m','En-US');
          console.log(this.detail,"user data")
         var services = this.detail[0].serviceNames.toString();
         this.allServices = JSON.parse(services).join(',');
          this.final_result_2 = "Afg1Jcfgc" + this.detail[0].id;
          console.log(this.detail[0].id,this.detail[0].serviceNames.toString())
          this.final_result_2 = btoa(this.final_result_2)
          this.final_result_2 = this.final_result_2.replaceAll('=', '');
          console.log(this.final_result_2,"booking id")
          let newDate = new Date(dateString);
          console.log("NewDate",newDate);
          console.log(this.myDate);
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
  // cancel(){
  //   console.log(this.detail,"all details")
  //   console.log(this.detail[0].appointment_no, this.detail[0].customer_name,this.users.email, this.users.phone)
  // }
  cancel(){
    // $('#CancelModal').modal('show');
    const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    
    let resp_cancel = this.http.post('http://65.1.176.15:5050/apis/cancelAppointment',{"booking_id": this.router.snapshot.params.id}, { headers: headers});
   
    resp_cancel.subscribe((result:any)=>{    
      console.log("cancel success", result)

      if(result.success == true){
        var request_cancel ={"email":this.users.email,"phone":this.users.phone};
     console.log("cancel not data", request_cancel)
        let resp_cancel_notification = this.http.post('http://65.1.176.15:5050/apis/cancel_notification',request_cancel,{ headers: headers});
   
        resp_cancel_notification.subscribe((result:any)=>{    
          console.log("cancel success notification", result)
          if(result.success == true){
            $("#cancelSuccess").show();
            $("#CancelModalLabel").hide();
            $("#cancelError").hide();
          }
         
          
        })
      }
     
      
    })
  }

}
