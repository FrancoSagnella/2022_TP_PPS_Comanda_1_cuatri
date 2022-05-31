import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaDuenioSupervisorComponent } from './alta-duenio-supervisor.component';

describe('AltaDuenioSupervisorComponent', () => {
  let component: AltaDuenioSupervisorComponent;
  let fixture: ComponentFixture<AltaDuenioSupervisorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaDuenioSupervisorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaDuenioSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
