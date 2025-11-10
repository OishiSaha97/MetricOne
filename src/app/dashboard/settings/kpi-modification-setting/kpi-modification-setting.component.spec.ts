import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiModificationSettingComponent } from './kpi-modification-setting.component';

describe('KpiModificationSettingComponent', () => {
  let component: KpiModificationSettingComponent;
  let fixture: ComponentFixture<KpiModificationSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiModificationSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpiModificationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
