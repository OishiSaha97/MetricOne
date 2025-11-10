import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproAttributePopUpComponent } from './appro-attribute-pop-up.component';

describe('ApproAttributePopUpComponent', () => {
  let component: ApproAttributePopUpComponent;
  let fixture: ComponentFixture<ApproAttributePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproAttributePopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproAttributePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
