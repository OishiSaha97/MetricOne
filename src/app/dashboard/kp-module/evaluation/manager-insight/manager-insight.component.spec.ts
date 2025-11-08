import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerInsightComponent } from './manager-insight.component';

describe('ManagerInsightComponent', () => {
  let component: ManagerInsightComponent;
  let fixture: ComponentFixture<ManagerInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerInsightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
