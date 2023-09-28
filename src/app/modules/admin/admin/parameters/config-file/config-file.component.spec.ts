import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigFileComponent } from './config-file.component';

describe('ConfigFileComponent', () => {
  let component: ConfigFileComponent;
  let fixture: ComponentFixture<ConfigFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
