import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { User } from '../_models/users';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
//import { User } from '../_models/users';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(  private router: Router,
        private http: HttpClient) {  
                this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();     
    }
      public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(mobile:any,whatsapp:any, orgId:any) {
        return this.http.post<any>(`http://65.1.176.15:5050/apis/customerLogin`, {"orgId":orgId, "phone":mobile,"wa_checked":whatsapp})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return user;
            }));
    }

    verifyOtp(otp:any,mobile:any, orgId:any){
         return this.http.post<any>(`http://65.1.176.15:5050/apis/verifyLoginOtp`, {"orgId":orgId, "phone":mobile,"otp":otp})
            .pipe(map(user => {
                user['org'] = orgId;
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (user.success){
                    this.router.navigate(['/appointment']);
                }
                return user;
            }));        
    }
    termsCondition(){
        return this.http.post<any>(`http://65.1.176.15:5050/apis/gettnc`, {"orgId":"lenskart"})
           .pipe(map(user => {
               return user;
           }));        
   }
   settingPWA(orgId:any){
    return this.http.get<any>(`http://65.1.176.15:5050/apis/getPWASettings/`+orgId)
       .pipe(map(user => {
           return user;
       }));        
}
    
     logout(orgId:any) {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        
        this.router.navigate(['login/'+orgId])
        //this.currentUserSubject.next(null);
    }
}   



