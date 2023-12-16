import { Injectable } from '@angular/core'
import { Platform } from '@ionic/angular'
import { Observable, ReplaySubject } from 'rxjs'
import { PermissionsService, PermissionStatus, PermissionTypes } from './permissions.service'

declare let QRScanner: any

@Injectable({
    providedIn: 'root'
  })
export class ScannerService {

  public hasCameras: boolean = false
  public isActive: boolean = false
  private readonly _hasCameraPermission: ReplaySubject<boolean> = new ReplaySubject()
  public readonly hasCameraPermission: Observable<boolean> = this._hasCameraPermission.asObservable()

  public constructor(
      private readonly platform: Platform,
      private readonly permissionsService: PermissionsService) {

  }

//   public async ionViewWillEnter(): Promise<void> {
//       await this.platform.ready()
//       await this.checkCameraPermissionsAndActivate()
//   }

  public async requestPermission(successCallback: (text: string) => void, errorCallback: ((text: string) => void)): Promise<void> {
    await this.permissionsService.userRequestsPermissions([PermissionTypes.CAMERA])
    await this.checkCameraPermissionsAndActivate(successCallback, errorCallback)
  }

  public async checkCameraPermissionsAndActivate(successCallback: (text: string) => void, errorCallback: ((text: string) => void)): Promise<void> {
    const permission: PermissionStatus = await this.permissionsService.hasCameraPermission()

    if (permission === PermissionStatus.GRANTED) {
      document.body.style.backgroundColor = 'transparent' // We need this for the background to be transparent when using dark mode
      this._hasCameraPermission.next(true)
      this.startScan(successCallback, errorCallback)
    } else {
      this._hasCameraPermission.next(false)
    }
  }

  public startScan(successCallback: (text: string) => void, errorCallback: ((text: string) => void) | null = null): void {
    this.scan(successCallback, errorCallback)
  }

  public checkScan(resultString: string): void {
    console.error(`The checkScan method needs to be overwritten. Ignoring text ${resultString}`)
  }

   /**
   * Start the QR scanner. It will make the background of the page transparent and scan until a QR is detected.
   *
   * @param successCallback
   * @param errorCallback
   */
    public scan(successCallback: (text: string) => void, errorCallback: ((text: string) => void) | null = null): void {
      this.isActive = true;
        (window as any).qrScanner.startScanner("Scan", "Point your phone to the QR code to scan it",
            "#0b0b0b", "Point your phone to the QR code to scan it", false, this.platform.isRTL, async (scannedData: string) => {
              successCallback(scannedData);
              this.stopScanner()
            }, (e: any) => {
              this.stopScanner();
            });
      }

    public stopScanner() {
        if (!this.isActive) {
          return;
        }
        setTimeout(() => {
          (window as any).qrScanner.stopScanner();
          this.isActive = false;
        }, 100);
      }
    
      public destroy(): void {
        (window as any).qrScanner.stopScanner();
      }

}