import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitChart } from './profit-chart';

describe('ProfitChart', () => {
  let component: ProfitChart;
  let fixture: ComponentFixture<ProfitChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
