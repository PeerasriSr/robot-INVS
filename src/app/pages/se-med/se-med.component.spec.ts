import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeMedComponent } from './se-med.component';

describe('SeMedComponent', () => {
  let component: SeMedComponent;
  let fixture: ComponentFixture<SeMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeMedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
