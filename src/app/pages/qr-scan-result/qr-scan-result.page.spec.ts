import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrScanResultPage } from './qr-scan-result.page';

describe('QrScanResultPage', () => {
  let component: QrScanResultPage;
  let fixture: ComponentFixture<QrScanResultPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QrScanResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
