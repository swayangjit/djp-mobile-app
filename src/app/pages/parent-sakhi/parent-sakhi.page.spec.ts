import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentSakhiPage } from './parent-sakhi.page';

describe('ParentSakhiPage', () => {
  let component: ParentSakhiPage;
  let fixture: ComponentFixture<ParentSakhiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentSakhiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
