import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppControllsComponent } from './app-controlls.component';

describe('AppControllsComponent', () => {
  let component: AppControllsComponent;
  let fixture: ComponentFixture<AppControllsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppControllsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppControllsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
