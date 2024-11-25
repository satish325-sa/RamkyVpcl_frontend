import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcustomerDetailsComponent } from './subcustomer-details.component';

describe('SubcustomerDetailsComponent', () => {
  let component: SubcustomerDetailsComponent;
  let fixture: ComponentFixture<SubcustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcustomerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
