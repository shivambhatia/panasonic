import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {IAngularMyDpOptions, IMyDateModel, MM} from 'angular-mydatepicker';
declare var $: any;
// import { FormGroup, FormControl ,Validators} from '@angular/forms';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  minDate = new Date();
  public mytime: Date = new Date();
  currentYear: any = this.mytime.getUTCFullYear();
  currentDate: any = this.mytime.getUTCDate() - 1;
  currentMonth: any = this.mytime.getUTCMonth() + 1;
  data : any;
  temp :any;
  public policies:any = [];
  public terms:any=[];
  services: any;
  private token : string;
  selectedServices:string []; 
  public filterDate:any=[]; 
  selectedBranch:string []; 
  final_result_2: string; 
  allBranchesServiceWise:any[];
  dataService = true;
  dataBranch = false;
  dataDateTime = false;
  dataContact = false;
  dataReview = false;
  dataRequest = false;
  allService : any;
  startRegistartionDate:any;
  allDateBranchWiseData : any[];
  datetimeArray: string[];
  public branchOff: any =[];
  public disable_dates : any = [];
  time:string;
  name:string;
  phone:string;
  email:string;
  note:string;
  tnc:string;
  public workingDays:any = [];
  public breaks:any = [];
  public nonWorking_days:any = [];
  public myDpOptions:any  = [];
  public break_time:any =[];
  message_2:any=[];
  message_3:any=[];
  message_8:any = [];
  message_1:any = [];
  message_4:any = [];
  booked_slots:any = [];
  dateData:string ;
  public userDataProfile:any =[];
  service_final:any = [];
  myStringArray:any = [];
  service_final_1:any = [];
  form: FormGroup;
final_result :any = [];;
 final_results :any = [];
 final_result_1:any = [];
  branch_final:any = [];
  public month:any = [];
  public year:any=[];
  public  Bookdate:any=[];
  appointment_date:any=[];
  filterTime:any =[];
  activeDays:any =[];
  startTime:any =[];
  endTime:any =[];
  servingTime :any =[];
  final_slots  :any =[];
timeslots_active :any =[];
  timeslots  :any =[];
  datetimeMsg:any = [];
  userData:any=[];
  constructor(private http: HttpClient,private router: Router,private fb: FormBuilder) { 
    
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if(users.success){
            // debugger;
            this.userData=users;
            this.userDataProfile=users.result;
  console.log(this.userDataProfile,"user ")
  
  
              this.token = users.token;       
              this.selectedServices=[];
              this.allBranchesServiceWise=[];
              this.allDateBranchWiseData=[];
               
          }   
        else{
          this.router.navigate(['/login']);
        }
        {
          this.form = this.fb.group({
          services: this.fb.array([],[Validators.required]),
          branch: this.fb.array([]),
          
        })
        }
    }
togglePrevious(pageType:string){
  if (pageType=='branch'){
    this.dataService=true;
    this.dataBranch=false;
    console.log(this.allService,"services checked")
  }
  if(pageType=='datetime'){
    console.log(this.selectedBranch[0],typeof this.selectedBranch[0], "brajhbkjb")
    // console.log($('input[name="myCheckbox"][id=branch' + this.selectedBranch[0] + ']').prop("checked", true));
    // $('input[name="myCheckbox"][id=branch' + this.selectedBranch[0] + ']').prop("checked", true);
    // $('#branch' + this.selectedBranch[0] + '').prop('checked', true); 
    console.log('#branch' + this.selectedBranch[0] + '' )
    this.dataBranch=true;
    $('#branch' + this.selectedBranch[0] + '').attr('checked', true);
    this.dataDateTime=false;
  }
  if(pageType=='requirement'){
    this.dataDateTime=true;
    this.dataContact=false;
  }

}
 toggle(pageType:string){
  
    if(pageType=='service'){
    if(this.myStringArray.length == 0){
      this.message_2 = "Service is required, select atleast one value"
      $("#err9").show();
     setTimeout(function(){
         $("#err9").hide();
       }, 3000);
      //
    }
    else{
    this.getBranchOnSelectedServices();
    this.dataService = false;
    this.dataBranch = true;
    }
  }
  if(pageType=='datetime'){
    console.log(this.appointment_date,this.time,"date and time")
    if(this.appointment_date && this.time!== ""){
      console.log("coming till here")
      // if(parent && this.time){
        //   this.dateData=JSON.stringify(parent).split('T')[0];

        //   this.dateData=this.dateData.replaceAll('"',"");
        //   var temp=this.dateData.split('-');
        //   this.dateData=temp[2]+"-"+temp[1]+'-'+temp[0]
        // console.log(this.dateData,"date selected")
          

        this.dataDateTime=false;
        this.dataContact=true;
        if(this.userDataProfile){
        this.profileForm.controls["profilename"].setValue(this.userDataProfile.name);
       this.profileForm.controls["email"].setValue(this.userDataProfile.email);
        this.profileForm.controls["phone"].setValue(this.userDataProfile.phone);
        // this.profileForm.controls['profilename'].disable();
        // this.profileForm.controls['email'].disable();
        // this.profileForm.controls['phone'].disable();
        this.email=this.userDataProfile.email;
        this.name=this.userDataProfile.name;
        this.phone=this.userDataProfile.phone;
        console.log(this.email,this.name,this.phone,"details")
         
      }
        
         
      }
      else{
        this.message_4 = "Please select date and time "
        $("#err4").show();
       setTimeout(function(){
           $("#err4").hide();
         }, 3000);
        console.log("Select toh kr le");
      }
  }

  if(pageType=='branch'){

  if(!$('.example:checked').is(':checked')){
        // this.dataDateTime=false;
        
        // console.log(this.allBranchesServiceWise)
        this.message_3 = "Branch is required, select atleast one value"
        $("#err2").show();
         setTimeout(function(){
          $("#err2").hide();
        }, 3000);

      }
    else{
     
     var branch_selected = $('.example:checked').is(':checked')
      //debugger;
      // this.onDateChanged(e);
      this.getDateTimeOnSelectedBranch();
      this.dataBranch=false;
      this.dataDateTime=true;
      //var myDate = new Date(new Date().getTime()+(5*24*60*60*1000));

      $(document).ready(function() {
        var currentdate = new Date(); 
        var someDate = new Date();
        var numberOfDaysToAdd = 15;
        someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 

      $('.datepicker').datepicker({
        format: "yy-mm-dd",
    startDate: new Date(currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate()),
    endDate: new Date(someDate.getFullYear() + "/"
                + (someDate.getMonth()+1)  + "/" 
                + someDate.getDate())
      }).on('changeDate', function(e:any) {  
        parent=e.date
        //this.getDateTimeOnSelectedBranch();    
    

      });   
      
    });


      
    }
  }
  if(pageType=='requirement'){
    console.log(this.name,this.note,this.phone,this.email,this.profileForm.value.note,this.profileForm.value.email,this.profileForm.value.profilename,this.profileForm.value.phone,"++++++++")
    if(this.profileForm.value.profilename ==  " "  || this.profileForm.value.email == "" || this.profileForm.value.phone == "" || this.profileForm.value.note == ""){
      // this.dataContact=false;
      this.dataReview=false;
      this.message_8 = "Please enter service requirements"
      $("#err8").show();
     setTimeout(function(){
         $("#err8").hide();
       }, 3000);
    }
    else if(!$('.tnc:checked').is(':checked')){
      this.dataReview=false;
      this.message_1 = "Please check terms and conditions"
      $("#err1").show();
     setTimeout(function(){
         $("#err1").hide();
       }, 3000);
    }
    else{
    this.dataContact=false;
    this.dataReview=true;
    const headers = { 'Authorization': 'Bearer '+this.token }
    
    var data={"id":this.userData.result.id,"name":this.profileForm.value.profilename,"email":this.profileForm.value.email};
    console.log(data);
    let resp=this.http.post('http://65.1.176.15:5050/apis/updateCustomer',data, { headers: headers});
   
    resp.subscribe((result:any)=>{    
        this.userData.result.name=result.result.name;
        this.userData.result.email=result.result.email;
        localStorage.setItem('currentUser', JSON.stringify(this.userData));
        this.name = result.result.name;
        this.email = result.result.email;
        // console.log(this.name,this.email,"userssssssssssssssssssss")
        // this.name.setValue(result.result.name);
        // this.email.setValue(result.result.email);
          
    })
    }
  }

  }

   profileForm = new FormGroup({
    profilename: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone :new FormControl('', Validators.required),
    tnc :new FormControl('', Validators.required),
    note:new FormControl('', Validators.required)
    
  
  });

  serviceExistenceCheck(id:string){
    


    if(this.selectedServices.indexOf(''+id)==-1){
      return false;
    }
    else{
      return true;
    }
  

  }

  branchExistenceCheck(id:string){
    
    
    if(this.selectedBranch!=undefined && this.selectedBranch.includes(''+ id)){
      return true;
    }
    else{
      return false;
    }
  

  }



  
   createAppointment(){
     console.log(this.allService,"Ok services")
    var final_date = moment(this.appointment_date).format("DD-MM-YYYY");
        const headers = { 'Authorization': 'Bearer '+this.token }
    var request={"appointment_date":this.appointment_date,"appointment_time":this.time,"email":this.profileForm.value.email,"name":this.profileForm.value.profilename,"note":this.profileForm.value.note,"tnc":this.tnc,"mobile":this.profileForm.value.phone,"services":this.allService,"mode":"web","branch":[[this.selectedBranch]]};
    console.log("data to submit",request); 
    let resp=this.http.post('http://65.1.176.15:5050/apis/create_appointment',request, { headers: headers});
    
    resp.subscribe((result)=>{
      // debugger;
      var request_create ={"email":this.profileForm.value.email,"phone":this.profileForm.value.phone};
      let resp_create_notification = this.http.post('http://65.1.176.15:5050/apis/create_notification',request_create,{ headers: headers});
   
      resp_create_notification.subscribe((result:any)=>{    
        console.log("create success notification", result)
       
        
      })
          console.log("app confrm ", result)
          this.final_result = result;
          this.final_results = this.final_result.data;
          this.final_result_1 = this.final_result.data.result;
        
      
         
          this.final_result_2 = "Afg1Jcfgc" + this.final_result_1.id;
          console.log(this.final_result_1.id)
          this.final_result_2 = btoa(this.final_result_2)
          this.final_result_2 = this.final_result_2.replaceAll('=', '');
          console.log(this.final_result_2,"booking id")
          this.dataRequest = true;
          this.dataReview = false;
      // this.router.navigate(['/appointment']);

    
    })


   }

  onContactSubmit(){
    console.log("Check all values",this.profileForm.value);
    this.name=this.userDataProfile?this.userDataProfile.name:this.profileForm.value.profilename;
    this.phone=this.userDataProfile?this.userDataProfile.phone:this.profileForm.value.phone;
    this.email=this.userDataProfile?this.userDataProfile.email:this.profileForm.value.email;
    this.note=this.profileForm.value.note;
    this.tnc=this.profileForm.value.tnc;
      
  }

 

  createDateTimePair(open_time:string,close_time:string){
    
//     var x = 30; //minutes interval
// var times = []; // time array
// var tt = parseInt(open_time.split(':')[0])*60+parseInt(open_time.split(':')[1]); // start time
// var ap = ['AM', 'PM']; // AM-PM


// //loop to increment the time and push results in array
// for (var i=0;tt<=(parseInt(close_time.split(':')[0])*60+parseInt(close_time.split(':')[1])); i++) {
//   var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
//   var mm = (tt%60); // getting minutes of the hour in 0-55 format
//   times[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
//   tt = tt + x;
// }
// var datetimeArray=[];
// for(i=0;i<times.length-1;i++){
//   datetimeArray.push(times[i]+'-'+times[i+1]);
  

// }
// this.datetimeArray=datetimeArray;
// const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    
// let resp_Bookslots = this.http.post('http://65.1.176.15:5050/apis/getAvailableSlot',{"serviceID":6,"branchID":1,"bookdate":"2021-08-18"}, { headers: headers});

// resp_Bookslots.subscribe((data:any)=>{
//   console.log(data,"booked slots")
// })



  }
  onItemChangeTime(value:any){
    this.time=this.datetimeArray[value];

  }

  

  getDateTimeOnSelectedBranch(){
       const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceData',{"service":this.selectedServices[0],"branch":this.allBranchesServiceWise[0].id,"appointment_date":"12-08-2021"}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allDateBranchWiseData = this.temp.result;
      
      //console.log(this.temp.result.open_time);
      this.createDateTimePair(this.temp.result.open_time,this.temp.result.close_time);
      
    })
  }

  getBranchOnSelectedServices(){

    const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceWiseBranch',{"service_name":[this.selectedServices]}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allBranchesServiceWise = this.temp.result
      //
      console.log("All branch data",this.allBranchesServiceWise);
      
    })



  }

  ngOnInit() {
    const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    console.log("Step 1",headers);
    var parent=this;
    let resp=this.http.post('http://65.1.176.15:5050/apis/getAllServices',{}, { headers: headers});
    //resp.subscribe((result)=>this.users=result);
    this.selectedServices=new Array<string>();
    resp.subscribe((result)=>{    
      this.data=result
      this.services = this.data.result
      console.log("Step 1",this.services);
           
      
    })
    // $(document).ready(function() {
    //   $('.datepicker').datepicker({
    //     format: "yy-mm-dd",
    // startDate: new Date('2019-12-5'),
    // endDate: new Date('2020-7-12')    
    //   }).on('changeDate', function(e:any) {  
    //     console.log("You changed me",e.date); 
    // });   
      
    // });
  }
  calendarshow(){
    this.dataContact = false;
    this.dataDateTime = true;
    console.log(this.time,"time checked")
    // $("input[name=TimeSlot][value=" + this.time + "]").attr('checked', 'checked');
    $('input:radio[name="TimeSlot"][value=' + this.time + ']').attr('checked',true);
  }
  reviewReq(){
    this.dataReview = false;
    this.dataContact = true;
 
  }
  servicesTab(){
    this.dataReview = false;
    this.dataService = true;
  }
  contactForm(){
    this.dataContact = true;
    this.dataReview = false;
  }
  getSelectedServiceId(e:any){

    var service  = e.target.value;
    var res = service.split("-")
      if(typeof res[1]!=='undefined'){
        var index = this.service_final.indexOf(res[1]);
        if(index>=0){
          this.service_final.splice(index, 1);
        }
        else{
          this.service_final.push(res[1]);
        }
      }
      this.service_final_1 = this.service_final.toString();
    const services: FormArray = this.form.get('services') as FormArray;
    if (e.target.checked) {
      services.push(new FormControl(e.target.value));
    }
    else {
      const index = services.controls.findIndex(x => x.value === e.target.value);
      services.removeAt(index);
    }
    var myStringArray  = services.value;

    var arrayLength = myStringArray.length;
    for (var i = 0; i < arrayLength; i++) {
        let nett = myStringArray[i].split("-")[0];
        myStringArray[i] = nett;
    }
    this.allService = myStringArray;
    console.log(myStringArray,"all services check")
    this.selectedServices = myStringArray[0] 
   this.myStringArray={ service: [myStringArray[0]]} ;
   console.log(this.selectedServices)
    // if(e.target.checked){
    //   this.selectedServices=[];
    //   //console.log("Checked Id",id);
    //   // this.selectedServices.push(id + "-"  + name);
    //   this.selectedServices.push(id);
    //   console.log(this.selectedServices,"service sleetecv")
      
    // }

    // else{
    //   this.selectedServices=this.selectedServices.filter(m=>m!=id);
    // }
    //console.log("Checking all the data",this.selectedServices);
  }

  getSelectedBranchId(e:any){
    $(".branch-checkbox").prop('checked', false);
    $('#' + e.target.id).prop('checked', true);
    this.selectedBranch=[];

    // $('.example').on('change', (()=> {
    //   console.log("chnagge")
    //   $('.example').not(this).prop('checked', false);
    //   }));
      
      var branch_1 = e.target.value
      var res = branch_1.split("-");
      if(typeof res[1]!=='undefined'){
        this.branch_final= res[1];
      }
      else{
        this.service_final= "";
      }
      const branch: FormArray = this.form.get('branch') as FormArray;
      if (e.target.checked) {
        branch.controls = [];
        branch.push(new FormControl([res[0]]));
      } else {
        const index = branch.controls.findIndex(x => x.value === [res[0]]);
        branch.removeAt(index);
      }
      this.selectedBranch = this.form.value.branch[0];
      console.log(this.selectedBranch,"branch selected")
      if(this.selectedBranch.length > 0){
        const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    
        let resp_Bookdate=this.http.post('http://65.1.176.15:5050/apis/getbookingdate',{}, { headers: headers});
       
        resp_Bookdate.subscribe((data:any)=>{ 
          console.log(data,"bok")
          if(data.success == true){
            this.activeDays = data.result.validDate ;
            this.policies = data.result.privacypolicy;
            this.terms = data.result.privacypolicy_terms;
            console.log(this.policies,this.terms)
          }
          else{
            this.activeDays = 15 ;
          }
          var startdate :any =  moment(new Date()).format("DD-MM-YYYY");
        var new_date = moment(startdate, "DD-MM-YYYY").add('days', this.activeDays);
        this.Bookdate = new_date.format('DD');
         this.month = new_date.format('MM');
        this.year= new_date.format('YYYY');
        console.log(this.Bookdate + '.' + this.month + '.' + this.year);
       
        let resp=this.http.post('http://65.1.176.15:5050/apis/getBranchSchedule',{"branch_id":this.selectedBranch}, { headers: headers});
       
        resp.subscribe((data:any)=>{ 
          
          // var branchSchedule = result1.result
          console.log(data.result,"branch schedule")
          
          this.nonWorking_days = data.result.non_working_days
          this.disable_dates = (data.result[0] &&  data.result[0].formattedHolidayList)|| [] ;
          const {holidays} = data.result && data.result[0] || {}
          this.branchOff = holidays ? JSON.parse(holidays) : [];
          console.log(this.branchOff,"branch holiday Found")
          this.break_time =(data.result[0] &&  data.result[0].breaks)|| "";
              this.myDpOptions = {

              inline: true,
              disableUntil: {year: this.currentYear, month: this.currentMonth, day: this.currentDate},
              dateFormat: 'dd-mm-yyyy',
              disableDates:this.disable_dates,
              disableWeekdays:this.nonWorking_days,
              disableSince:{year: this.year , month: this.month , day: this.Bookdate }
              };
              let resp_3=this.http.post('http://65.1.176.15:5050/apis/getServiceData',{"service":[this.selectedServices],"branch":this.selectedBranch}, { headers: headers});
       
              resp_3.subscribe((data:any)=>{ 
                console.log(data, "service data  3333")
                if(data.success == true){
                  this.startTime = data.result.open_time;
                  this.endTime = data.result.close_time;
                  this.servingTime = data.result.serving_time;
                  this.onDateChanged(e);
                }
              })
              
        // this.onDateChanged(e);
          })
        })
        
      }
      
    // if(e.target.checked){
    //   this.selectedBranch=[];
    //   //console.log("Checked Id",id);
    //   this.selectedBranch.push(id + "-"  + name);
    //   console.log(this.selectedBranch,"branch sleetecv")
      
    // }

    // else{
    //   this.selectedBranch=this.selectedBranch.filter(m=>m!=id);
    // }
    //console.log("Checking all the data",this.selectedServices);
  }
  datetimeChangeCheck(value:any){
    console.log("Check Value",value);

  } 
  onDateChanged(event: IMyDateModel): void {

    var weekOff = this.branchOff;



    $("input[type=radio][name=TimeSlot]").prop('checked', false);
    this.time = '';
    this.appointment_date = (event.singleDate?.formatted);
    if(!this.appointment_date)
      this.appointment_date = moment(new Date()).format("DD-MM-YYYY");
      var date_op = this.appointment_date;
        const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
     console.log(this.appointment_date,"app date")
    var bookdate  = this.appointment_date.split('-').reverse().join('-')
    console.log(bookdate,"book date")
    var request_slots={"serviceID":this.selectedServices,"branchID":this.selectedBranch[0],"bookdate":bookdate} 
    console.log("Step 4",request_slots)  
    let resp_Bookslots = this.http.post('http://65.1.176.15:5050/apis/getAvailableSlot',request_slots, { headers: headers});

    resp_Bookslots.subscribe((data:any)=>{
      console.log(data,"slots available")
   
        var slots = data.availableslots;
        console.log(slots,"slots")
        // var availableSlots = slots.availableslots;
        // console.log(availableSlots,"ava slot")
        this.datetimeArray=slots; 
       
        console.log(this.datetimeArray ,"++++++slots")
        
      
     
    })
      
    
      
   
  
  // this.displayElement = true;
    
  }
  cancel(){
    // $('#CancelModal').modal('show');
    const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    
    let resp_cancel = this.http.post('http://65.1.176.15:5050/apis/cancelAppointment',{"booking_id": this.final_result_1.id}, { headers: headers});
   
    resp_cancel.subscribe((result:any)=>{    
      console.log("cancel success", result)

      if(result.success == true){
        var request_cancel ={"email":this.profileForm.value.email,"phone":this.profileForm.value.phone};
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
  reschedule(){
    $('#RescheduleModal').modal('hide');
  }
 

}
