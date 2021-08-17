import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ServicesComponent } from './services/services.component';
import { HeaderComponent } from './header/header.component';
import { BranchComponent } from './branch/branch.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { ContactformComponent } from './contactform/contactform.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { RequestReviewComponent } from './request-review/request-review.component';
import { RequestConfirmedComponent } from './request-confirmed/request-confirmed.component';
import { ProfileComponent } from './profile/profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UserAppointmentService } from './user-appointment.service';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OtpComponent,
    AppointmentComponent,
    ServicesComponent,
    HeaderComponent,
    BranchComponent,
    DatetimeComponent,
    ContactformComponent,
    TitlebarComponent,
    RequestReviewComponent,
    RequestConfirmedComponent,
    ProfileComponent,
    BookAppointmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMyDatePickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [UserAppointmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
