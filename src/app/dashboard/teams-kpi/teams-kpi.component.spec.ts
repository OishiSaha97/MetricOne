import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsKPIComponent } from './teams-kpi.component';

describe('TeamsKPIComponent', () => {
  let component: TeamsKPIComponent;
  let fixture: ComponentFixture<TeamsKPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsKPIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsKPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
