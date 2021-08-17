import { TestBed } from '@angular/core/testing';

import { UserAppointmentService } from './user-appointment.service';

describe('UserAppointmentService', () => {
  let service: UserAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
