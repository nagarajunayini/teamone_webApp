import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifypostsComponent } from './verifyposts.component';

describe('VerifypostsComponent', () => {
  let component: VerifypostsComponent;
  let fixture: ComponentFixture<VerifypostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifypostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifypostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
