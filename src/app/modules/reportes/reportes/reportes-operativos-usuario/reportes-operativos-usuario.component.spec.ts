import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesOperativosUsuarioComponent } from './reportes-operativos-usuario.component';

describe('ReportesOperativosUsuarioComponent', () => {
  let component: ReportesOperativosUsuarioComponent;
  let fixture: ComponentFixture<ReportesOperativosUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesOperativosUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesOperativosUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
