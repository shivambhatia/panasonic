import { Component, OnInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.css']
})

export class DatetimeComponent implements OnInit {
  title = 'Select Date & Time';

constructor() { }

  ngOnInit(): void {
    
    $(document).ready(function() {
      //alert('I am Called From jQuery');
      $('.datepicker').datepicker();	
    });

  }

}
