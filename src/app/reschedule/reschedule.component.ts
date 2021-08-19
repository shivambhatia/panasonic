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
  selector: 'app-reschedule',
  templateUrl: './reschedule.component.html',
  styleUrls: ['./reschedule.component.css']
})
export class RescheduleComponent implements OnInit {
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
  appointment_time:string;
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

 
  public bookedDate:any = [];
  public bookedDate1:any = [];
  public service_selected:any =[];
  public branch_selected:any = [];
  public startDate:any = [];
  public endDate:any = [];
  public phoneNo:any= [];
  public userName:any = [];
  public booking_id:any = [];
 public request_create:any = [];
  public BranchId:any=[];
  
  public otpData :any = [];
 

  public Branchid:any =[];
  constructor(private http: HttpClient,private router: Router,private route: ActivatedRoute,private fb: FormBuilder) { 
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
       
   }

  ngOnInit(): void {
    let bookingid = atob(this.route.snapshot.params.booking_id);
    var staticString = "Afg1Jcfgc";
    this.booking_id = parseInt(bookingid.replace(staticString,''));
    const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    console.log("Step 1",headers);
    var parent=this;
    let resp=this.http.post('http://65.1.176.15:5050/apis/reshedule',{"booking_id":  this.booking_id}, { headers: headers});
    resp.subscribe((data:any)=>{    
    
      console.log(data, "reschedule data")
      var today =  moment().format('YYYY-MM-DD');
      // var appBookdate = bookedData.appointment_date;
      var bookedData = data.booking_detail;
      var appBookdate =   bookedData.appointment_date;
      var d = new Date();
      var h =  d.getHours();
      var m = d.getMinutes();
      var currentTime = h + ":" + m
      var appBook_time = bookedData.appointment_time.split("-")[0];
      console.log(today,appBookdate,today > appBookdate)
      var regex = new RegExp(':', 'g');
    
     
      this.service_selected = data.services.id;
      this.branch_selected = data.booking_detail.branch_id;
      this.bookedDate1 = data.booking_detail.appointment_date;
      this.appointment_date = moment(data.booking_detail.appointment_date).format("DD-MM-YYYY");
      this.appointment_time = data.booking_detail.appointment_time;
      this.phoneNo =  bookedData["customer.contact_no"];
      var service_select ={ services:[data.booking_detail.services] };
      var branchSelect = {branch :[data.booking_detail.branch_id]}
      this.email = bookedData["customer.email"];
      var userName ={ name: bookedData["customer.name"]};
      var email ={email: bookedData["customer.email"]};
      var contactNo = {mobile:bookedData["customer.contact_no"]};
      var note = {note: bookedData.note}
      var book_id = { booking_id: this.booking_id}
      var phone = {phone:bookedData["customer.contact_no"]};
      this.userName = {...userName, ...email, ...note, ...contactNo, ...service_select, ...branchSelect, ...book_id};
      this.request_create ={"email": bookedData["customer.email"],"phone":bookedData["customer.contact_no"]};
      this.otpData = { ...email, ...phone}
      // this.form.patchValue({appointment_time: this.appointment_time})
      this.bookedDate1 =moment(this.bookedDate1).format("DD-MM-YYYY");
      var branchData = { branch: this.branch_selected};
      var serviceData=   {service: this.service_selected }
      serviceData = { ...branchData, ...serviceData}
      const headers = { 'Authorization': 'Bearer '+this.token }
      let resp_3=this.http.post('http://65.1.176.15:5050/apis/getServiceData',serviceData, { headers: headers});
       
      resp_3.subscribe((data:any)=>{ 
            if(data.success == true){
              this.startDate = data.result.open_time;
              this.endDate = data.result.close_time;
              this.servingTime = data.result.serving_time;
            }
          })

          var appointment_date = data.booking_detail.appointment_date;
          this.bookedDate= appointment_date.split("-");

              this.myDpOptions = {
              stylesData: {
                selector: 'dp1',
                styles: `
                  .dp1 .yogaDates {
                    background-color: beige;
                    color: #17469e;
                    box-shadow: inset 0 0 0 2px #17469e;
                    font-weight: bold;
                    border-radius: 8px;
                  }`},
              inline: true,
              disableSince:{year: this.year , month: this.month , day: this.Bookdate },
              markDates: [{dates: [{year: parseInt(this.bookedDate[0]), month: parseInt(this.bookedDate[1]) , day: parseInt(this.bookedDate[2])}],  styleClass: 'yogaDates'}],
              disableUntil: {year: this.currentYear, month: this.currentMonth, day: this.currentDate},
              dateFormat: 'dd-mm-yyyy',
              disableDates:this.disable_dates,
              disableWeekdays:this.nonWorking_days,

              };
              console.log(this.myDpOptions,"mydppoption")
              var abc = parseInt(this.bookedDate[0])
              var branch_select =  {branch_id: [this.branch_selected] };
              branch_select = { ...branch_select};
             
              var bookdate  = this.appointment_date.split('-').reverse().join('-')
              console.log(bookdate,"book date")
        let resp_Bookdate=this.http.post('http://65.1.176.15:5050/apis/getbookingdate',{}, { headers: headers});
       
        resp_Bookdate.subscribe((data:any)=>{ 
                console.log(data,"bookingdate")
                if(data.success == true){
                  this.activeDays = data.result.validDate ;
                }
                else{
                  this.activeDays = 15 ;
                }
                console.log(this.activeDays,"bookingDate")
                
                var startdate :any =  moment(new Date()).format("DD-MM-YYYY");
                var new_date = moment(startdate, "DD-MM-YYYY").add('days', this.activeDays);

                this.Bookdate = new_date.format('DD');
                 this.month = new_date.format('MM');
                this.year= new_date.format('YYYY');
                console.log(this.Bookdate + '.' + this.month + '.' + this.year);
                let resp=this.http.post('http://65.1.176.15:5050/apis/getBranchSchedule',branch_select, { headers: headers});
       
                resp.subscribe((data:any)=>{ 
                  this.nonWorking_days = data.result.non_working_days
                  const {holidays} = data.result && data.result[0] || {}
                  this.branchOff = holidays ? JSON.parse(holidays) : [];
                  this.disable_dates = (data.result[0] &&  data.result[0].formattedHolidayList)|| [] ;
                  this.break_time =(data.result[0] &&  data.result[0].breaks)|| "";
                      this.myDpOptions = {
                        inline: true,
                        disableSince:{year: this.year , month: this.month , day: this.Bookdate },
                        disableUntil: {year: this.currentYear, month: this.currentMonth, day: this.currentDate},
                        dateFormat: 'dd-mm-yyyy',
                        disableDates:this.disable_dates,
                        disableWeekdays:this.nonWorking_days,
                      };
                      var weekOff = this.branchOff;
                var date_op = this.bookedDate1;
               
               

              })
            })
            var request_slots={"serviceID":this.service_selected,"branchID": this.branch_selected,"bookdate":bookdate} 
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

          
    
   
      
      
    })
  }

  onItemChangeTime(value:any){
    this.time=this.datetimeArray[value];

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
  createAppointment(){
    console.log(this.allService,"Ok services")
   var final_date = moment(this.appointment_date).format("DD-MM-YYYY");
       const headers = { 'Authorization': 'Bearer '+this.token }
   var request={"appointment_date":this.appointment_date,"appointment_time":this.time,"booking_id":  this.booking_id,"email":this.profileForm.value.email,"name":this.profileForm.value.profilename,"note":this.profileForm.value.note,"tnc":this.tnc,"mobile":this.profileForm.value.phone,"services":this.allService,"mode":"web","branch":[[this.selectedBranch]]};
   console.log("data to submit",request); 
   let resp=this.http.post('http://65.1.176.15:5050/apis/resheduleUpdate',request, { headers: headers});
   
   resp.subscribe((result:any)=>{
    console.log(result,"reschedule uodate")
    
    
     let resp_create_notification = this.http.post('http://65.1.176.15:5050/apis/reschedule_appointment',this.request_create,{ headers: headers});
  
     resp_create_notification.subscribe((result:any)=>{    
       console.log("update success notification", result)
      
       
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
  reviewReq(){
    this.dataReview = false;
    this.dataContact = true;
 
  }
  contactForm(){
    this.dataContact = true;
    this.dataReview = false;
  }
  calendarshow(){
    this.dataContact = false;
    this.dataDateTime = true;
    console.log(this.time,"time checked")
    // $("input[name=TimeSlot][value=" + this.time + "]").attr('checked', 'checked');
    $('input:radio[name="TimeSlot"][value=' + this.time + ']').attr('checked',true);
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


}
