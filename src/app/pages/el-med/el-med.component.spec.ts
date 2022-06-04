import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElMedComponent } from './el-med.component';

describe('ElMedComponent', () => {
  let component: ElMedComponent;
  let fixture: ComponentFixture<ElMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElMedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
