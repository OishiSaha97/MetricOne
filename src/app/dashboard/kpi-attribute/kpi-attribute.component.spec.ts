import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiAttributeComponent } from './kpi-attribute.component';

describe('KpiAttributeComponent', () => {
  let component: KpiAttributeComponent;
  let fixture: ComponentFixture<KpiAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiAttributeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
