import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { BranchComponent } from './branch/branch.component';
import { ContactformComponent } from './contactform/contactform.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestConfirmedComponent } from './request-confirmed/request-confirmed.component';
import { RequestReviewComponent } from './request-review/request-review.component';
import { ServicesComponent } from './services/services.component';

import { PolicyComponent } from './policy/policy.component';
import { RescheduleComponent } from './reschedule/reschedule.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'appointment-details/:id', component: OtpComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'branch', component: BranchComponent },
  { path: 'datetime', component: DatetimeComponent },
  { path: 'contact', component: ContactformComponent },
  { path: 'request-review', component: RequestReviewComponent },
  { path: 'request-confirmed', component: RequestConfirmedComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'policy', component: PolicyComponent },
  { path: ':booking_id/reschedule', component: RescheduleComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
