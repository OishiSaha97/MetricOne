import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesComponentComponent } from './values-component.component';

describe('ValuesComponentComponent', () => {
  let component: ValuesComponentComponent;
  let fixture: ComponentFixture<ValuesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuesComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValuesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
