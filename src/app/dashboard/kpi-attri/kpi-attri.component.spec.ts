import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiAttriComponent } from './kpi-attri.component';

describe('KpiAttriComponent', () => {
  let component: KpiAttriComponent;
  let fixture: ComponentFixture<KpiAttriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiAttriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiAttriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
