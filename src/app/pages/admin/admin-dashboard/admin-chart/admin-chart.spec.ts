import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChart } from './admin-chart';

describe('AdminChart', () => {
  let component: AdminChart;
  let fixture: ComponentFixture<AdminChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
