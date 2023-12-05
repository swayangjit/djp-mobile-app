import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyPitaraPage } from './mypitara.page';

describe('MyPitaraPage', () => {
  let component: MyPitaraPage;
  let fixture: ComponentFixture<MyPitaraPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyPitaraPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPitaraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
