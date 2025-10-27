import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeKPIComponent } from './all-employee-kpi.component';

describe('AllEmployeeKPIComponent', () => {
  let component: AllEmployeeKPIComponent;
  let fixture: ComponentFixture<AllEmployeeKPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEmployeeKPIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEmployeeKPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
