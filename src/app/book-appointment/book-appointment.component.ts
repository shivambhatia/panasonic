import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var $: any;

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
  allDateBranchWiseData : string[];
  changeDate(event: any) {




}


togglePrevious(pageType:string){
  if (pageType=='branch'){
    this.dataService=true;
    this.dataBranch=false;
  }
  if(pageType=='datetime'){
    this.dataBranch=true;
    this.dataDateTime=false;
  }



}
  toggle(pageType:string){
  
    if(pageType=='service'){
    if(this.selectedServices.length==0){

      console.log("Please select any of the above services");
    }
    else{
      console.log("We are getting branch data");
      this.getBranchOnSelectedServices();

    this.dataService = false;
    this.dataBranch = true;
    }
  }
  if(pageType=='datetime'){


    //Check datetime selected value;
  }

  if(pageType=='branch'){
    // check branch selected;

    if(this.allBranchesServiceWise.length==0){
      console.log("Please select the branch");

    }
    else{
      console.log("Selected Branches",this.allBranchesServiceWise);
      this.getDateTimeOnSelectedBranch();
      this.dataBranch=false;
      this.dataDateTime=true;
       $(document).ready(function() {
      $('.datepicker').datepicker();  
    });
    }
  }



    // this.dataDateTime
    // this.dataContact = !this.dataContact
    // this.dataReview = !this.dataReview
    // this.dataRequest = !this.dataRequest
  }


  constructor(private http: HttpClient) {    
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk'       
    this.selectedServices=[];
    this.allBranchesServiceWise=[];
    this.allDateBranchWiseData=[];
  }

  getSelectedDatetime(){
        const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceData',{"service":this.selectedServices[0],"branch":this.allBranchesServiceWise[0]}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allBranchesServiceWise = this.temp.result
      console.log("All branch data",this.allBranchesServiceWise);
      
    })

  }

  getDateTimeOnSelectedBranch(){
       const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    console.log("All selected dates",this.selectedServices[0],this.allBranchesServiceWise[0]);
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceData',{"service":this.selectedServices[0],"branch":this.allBranchesServiceWise[0]}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allDateBranchWiseData = this.temp.result
      console.log("All branch data",this.allDateBranchWiseData);
      
    })
  }

  getBranchOnSelectedServices(){

    const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getServiceWiseBranch',{"service_name":this.selectedServices}, { headers: headers});
   
    resp.subscribe((result)=>{    
      this.temp=result
      this.allBranchesServiceWise = this.temp.result
      console.log("All branch data",this.allBranchesServiceWise);
      
    })



  }

  ngOnInit() {
    const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25OYW1lIjoiYmF0YSIsImlhdCI6MTYyODE2MzgzMCwiZXhwIjoxNjI4ODU1MDMwfQ.0MX9h8hrCEQmeH49TZiU9Akn7bHXQ7bnqZsrcXfJEIk', 'My-Custom-Header': '' }
    
    let resp=this.http.post('http://65.1.176.15:5050/apis/getAllServices',{"id":1}, { headers: headers});
    //resp.subscribe((result)=>this.users=result);
    this.selectedServices=new Array<string>();
    resp.subscribe((result)=>{    
      this.data=result
      this.services = this.data.result
           
      
    })
    $(document).ready(function() {
      $('.datepicker').datepicker();	
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
