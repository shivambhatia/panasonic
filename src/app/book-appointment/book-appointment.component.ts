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
  services: any;
  private token : string;
  selectedServices:string []; 
  public filterDate:any=[]; 
  selectedBranch:string [];  
  allBranchesServiceWise:any[];
  dataService = true;
  dataBranch = false;
  dataDateTime = false;
  dataContact = false;
  dataReview = false;
  dataRequest = false;
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
  dateData:string ;
  public userDataProfile:any =[];
  service_final:any = [];
  myStringArray:any = [];
  service_final_1:any = [];
  form: FormGroup;
  branch_final:any = [];
  public month:any = [];
  public year:any=[];
  public  Bookdate:any=[];
  appointment_date:any=[];
  filterTime:any =[];
  activeDays:any =[];

  constructor(private http: HttpClient,private router: Router,private fb: FormBuilder) { 
    
    let users = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if(users.success){
            // debugger;
            this.userDataProfile=users.result;
  
  
  
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
  }
  if(pageType=='datetime'){
    console.log(this.selectedBranch[0],typeof this.selectedBranch[0], "brajhbkjb")
    console.log($('input[name="myCheckbox"][id=branch' + this.selectedBranch[0] + ']').prop("checked", true));
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
      this.message_2 = "Service is required,select atleast one value"
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
        this.profileForm.controls['profilename'].disable();
        this.profileForm.controls['email'].disable();
        this.profileForm.controls['phone'].disable();
        this.email=this.userDataProfile.email;
        this.name=this.userDataProfile.name;
        this.phone=this.userDataProfile.phone;
         
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
        this.message_3 = "Branch is required,select atleast one value"
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
    console.log(this.name,this.note,this.phone,this.email,this.profileForm.value.note,"++++++++")
    if(this.name ==  " "  || this.email == "" || this.phone == "" || this.profileForm.value.note == ""){
      // this.dataContact=false;
      this.dataReview=false;
      this.message_8 = "Please enter service requirements"
      $("#err8").show();
     setTimeout(function(){
         $("#err8").hide();
       }, 3000);
      console.log("jjblj")
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
    }
  }



    // this.dataDateTime
    // this.dataContact = !this.dataContact
    // this.dataReview = !this.dataReview
    // this.dataRequest = !this.dataRequest
  }

   profileForm = new FormGroup({
    profilename: new FormControl({value:''}, Validators.required),
    email: new FormControl({value:'',disabled:true}, Validators.required),
    phone :new FormControl({value:'',disabled:true}, Validators.required),
    tnc :new FormControl('', Validators.required),
    note:new FormControl('', Validators.required)
    
  
  });


  //  getNoOfDaysOnSelectedBranch(){
    
  //    var date_today = moment(new Date()).format("DD-MM-YYYY");
  //    console.log(date_today,"date +++++++++")
  //    if(this.appointment_date_selected!== ""){
  //      this.appointment_date = this.appointment_date_selected
  //    }
  //    else{
  //      this.appointment_date = date_today
  //    }
     
  //    console.log("comng here2", this.appointment_date)
  //   //  var appointment_date  = {appointment_date: this.appointment_date}
  //       const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
  //   var request={"service":[this.selectedServices],"branch":[this.selectedBranch[0]],"appointment_date":this.appointment_date} 
  //   console.log("Step 2",request)  
  //   let resp=this.http.post('http://65.1.176.15:5050/apis/getBookedSlot',request, { headers: headers});
   
  //   resp.subscribe((result)=>{    
  //    console.log("Max no of days from today",result);
      
  //   })

  //  }

   createAppointment(){
    var final_date = moment(this.appointment_date).format("DD-MM-YYYY");
        const headers = { 'Authorization': 'Bearer '+this.token }
    var request={"appointment_date":this.appointment_date,"appointment_time":this.time,"email":this.email,"name":this.name,"note":this.note,"tnc":this.tnc,"mobile":this.phone,"services":[this.selectedServices],"mode":"web","branch":[[this.selectedBranch]]};
    console.log("data to submit",request); 
    let resp=this.http.post('http://65.1.176.15:5050/apis/create_appointment',request, { headers: headers});
    
    resp.subscribe((result)=>{
      // debugger;


      this.router.navigate(['/appointment']);

    
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
    
    var x = 30; //minutes interval
var times = []; // time array
var tt = parseInt(open_time.split(':')[0])*60+parseInt(open_time.split(':')[1]); // start time
var ap = ['AM', 'PM']; // AM-PM


//loop to increment the time and push results in array
for (var i=0;tt<=(parseInt(close_time.split(':')[0])*60+parseInt(close_time.split(':')[1])); i++) {
  var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
  var mm = (tt%60); // getting minutes of the hour in 0-55 format
  times[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
  tt = tt + x;
}
var datetimeArray=[];
for(i=0;i<times.length-1;i++){
  datetimeArray.push(times[i]+'-'+times[i+1]);
  

}
this.datetimeArray=datetimeArray;




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
          this.break_time =(data.result[0] &&  data.result[0].breaks)|| "";
              this.myDpOptions = {

              inline: true,
              disableUntil: {year: this.currentYear, month: this.currentMonth, day: this.currentDate},
              dateFormat: 'dd-mm-yyyy',
              disableDates:this.disable_dates,
              disableWeekdays:this.nonWorking_days,
              disableSince:{year: this.year , month: this.month , day: this.Bookdate }
              };
              console.log(this.myDpOptions)
        this.onDateChanged(e);
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
    console.log(this.appointment_date,"date")
    if(!this.appointment_date)
      this.appointment_date = moment(new Date()).format("DD-MM-YYYY");
     
     console.log("comng here2", this.appointment_date)
    //  var appointment_date  = {appointment_date: this.appointment_date}
        const headers = { 'Authorization': 'Bearer '+this.token, 'My-Custom-Header': '' }
    var request={"service":[this.selectedServices],"branch":[this.selectedBranch[0]],"appointment_date":this.appointment_date} 
    console.log("Step 2",request)  
    let resp=this.http.post('http://65.1.176.15:5050/apis/getBookedSlot',request, { headers: headers});
   
    resp.subscribe((result)=>{    
     console.log("Max no of days from today",result);
      
    })
      
   
  
  // this.displayElement = true;
    
  }
 

}
