import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from "@angular/common";
declare var $: any;
import { FormGroup, FormControl ,Validators} from '@angular/forms';
@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  data : any;
  temp :any;
  services: any;
  private token : string;
  selectedServices:string [];  
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
  time:string;
  name:string;
  phone:string;
  email:string;
  note:string;
  tnc:string;
  dateData:string ;

  

togglePrevious(pageType:string){
  if (pageType=='branch'){
    this.dataService=true;
    this.dataBranch=false;
  }
  if(pageType=='datetime'){
    this.dataBranch=true;
    this.dataDateTime=false;
  }
  if(pageType=='requirement'){
    this.dataDateTime=true;
    this.dataContact=false;
  }


}
  toggle(pageType:string){
  
    if(pageType=='service'){
    if(this.selectedServices.length==0){

      //
    }
    else{
      
      this.getBranchOnSelectedServices();

    this.dataService = false;
    this.dataBranch = true;
    }
  }
  if(pageType=='datetime'){
    

      if(parent && this.time){
          this.dateData=JSON.stringify(parent).split('T')[0];
          this.dateData=this.dateData.replaceAll('"',"");

        this.dataDateTime=false;
        this.dataContact=true;
      }
      else{

        console.log("Select toh kr le");
      }
  }

  if(pageType=='branch'){
    // check branch selected;

    if(this.allBranchesServiceWise.length==0){
      

    }
    else{
  
      this.getDateTimeOnSelectedBranch();
      this.dataBranch=false;
      this.dataDateTime=true;
      
      $(document).ready(function() {
      $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        todayBtn:  1,
   
      }).on('changeDate', function(e:any) {  
        parent=e.date    
    

      });   
      
    });


      
    }
  }
  if(pageType=='requirement'){
    this.dataContact=false;
    this.dataReview=true;
  }



    // this.dataDateTime
    // this.dataContact = !this.dataContact
    // this.dataReview = !this.dataReview
    // this.dataRequest = !this.dataRequest
  }
   profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone :new FormControl('', Validators.required),
    tnc :new FormControl('', Validators.required),
    note:new FormControl('', Validators.required)
  });

   createAppointment(){
        const headers = { 'Authorization': 'Bearer '+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODU0MDc2NSwiZXhwIjoxNjI5MjMxOTY1fQ.EsQfPmKf-0Cy9yJhaxmzYNvQ9ttEfn9tb3uCynkKh5c' }
    var request={"appointment_date":this.dateData,"appointment_time":this.time,"email":this.email,"name":this.name,"note":this.note,"tnc":this.tnc,"mobile":this.phone,"services":this.selectedServices,"mode":"web","branch":[[this.allBranchesServiceWise[0].id]]};
    console.log("Request",request,this.allBranchesServiceWise[0].id);
    let resp=this.http.post('http://65.1.176.15:5050/apis/create_appointment',request, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allDateBranchWiseData = this.temp.result;
      
      //console.log(this.temp.result.open_time);
      this.createDateTimePair(this.temp.result.open_time,this.temp.result.close_time);
      
    })


   }

onContactSubmit(){
   this.name=this.profileForm.value.name;
  this.phone=this.profileForm.value.phone;
   this.email=this.profileForm.value.email;
   this.note=this.profileForm.value.note;
   this.tnc=this.profileForm.value.tnc;
     
}

  constructor(private http: HttpClient) {    
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk'       
    this.selectedServices=[];
    this.allBranchesServiceWise=[];
    this.allDateBranchWiseData=[];
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
       const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceData',{"service":1,"branch":1}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allDateBranchWiseData = this.temp.result;
      
      //console.log(this.temp.result.open_time);
      this.createDateTimePair(this.temp.result.open_time,this.temp.result.close_time);
      
    })
  }

  getBranchOnSelectedServices(){

    const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceWiseBranch',{"service_name":this.selectedServices}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allBranchesServiceWise = this.temp.result
      //
      console.log("All branch data",this.allBranchesServiceWise);
      
    })



  }

  ngOnInit() {
    const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    var parent=this;
    let resp=this.http.post('http://65.1.176.15:5050/apis/getAllServices',{"id":1}, { headers: headers});
    //resp.subscribe((result)=>this.users=result);
    this.selectedServices=new Array<string>();
    resp.subscribe((result)=>{    
      this.data=result
      this.services = this.data.result
           
      
    })
    $(document).ready(function() {
      $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
      }).on('changeDate', function(e:any) {  
        console.log("You changed me",e.date); 
    });   
      
    });
  }
  getSelectedServiceId(e:any,id:string){


    if(e.target.checked){
      this.selectedServices=[];
      //console.log("Checked Id",id);
      this.selectedServices.push(id);
    }

    else{
      this.selectedServices=this.selectedServices.filter(m=>m!=id);
    }
    //console.log("Checking all the data",this.selectedServices);
  }
  datetimeChangeCheck(value:any){
    console.log("Check Value",value);

  } 

}
