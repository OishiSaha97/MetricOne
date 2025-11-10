import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalApprovalPopUpComponent } from './final-approval-pop-up.component';

describe('FinalApprovalPopUpComponent', () => {
  let component: FinalApprovalPopUpComponent;
  let fixture: ComponentFixture<FinalApprovalPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalApprovalPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalApprovalPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
