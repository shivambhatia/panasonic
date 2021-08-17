import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestConfirmedComponent } from './request-confirmed.component';

describe('RequestConfirmedComponent', () => {
  let component: RequestConfirmedComponent;
  let fixture: ComponentFixture<RequestConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestConfirmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
