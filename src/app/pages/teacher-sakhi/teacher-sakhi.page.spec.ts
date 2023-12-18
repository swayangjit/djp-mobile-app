import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherSakhiPage } from './teacher-sakhi.page';

describe('TeacherSakhiPage', () => {
  let component: TeacherSakhiPage;
  let fixture: ComponentFixture<TeacherSakhiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeacherSakhiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
