import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.css']
})
export class ContactformComponent implements OnInit {
  title = 'Contact Details';
  constructor() { }

  ngOnInit(): void {
  }

}
