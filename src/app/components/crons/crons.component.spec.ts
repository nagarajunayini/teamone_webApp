import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronsComponent } from './crons.component';

describe('CronsComponent', () => {
  let component: CronsComponent;
  let fixture: ComponentFixture<CronsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not be empty',()=>{
    expect(component.rules.length).not.toBe(0);
  });
});
