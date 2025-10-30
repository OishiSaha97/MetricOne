import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiAttriPopUpComponent } from './kpi-attri-pop-up.component';

describe('KpiAttriPopUpComponent', () => {
  let component: KpiAttriPopUpComponent;
  let fixture: ComponentFixture<KpiAttriPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiAttriPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiAttriPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
