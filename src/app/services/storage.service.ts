import { Injectable } from '@angular/core';
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static readonly groupPreferenceName = 'DJPData'
  constructor() { }

  async setData(key: string, value: string): Promise<any> {
    await Preferences.configure({group: StorageService.groupPreferenceName})
    await Preferences.set({key, value})
    .then((res: any) => {
      return res;
    }).catch(err => {return err})
  }

  async getData(key: string): Promise<any> {
    Preferences.configure({group: StorageService.groupPreferenceName})
    Preferences.get({key}).then((res: any) => {

    }).catch(err => {return err})
  }

  async removeData(key: string): Promise<any> {
    Preferences.configure({group: StorageService.groupPreferenceName})
    Preferences.remove({key}).then((res: any) => {

    }).catch(err => {return err})
  }

  async getStorageKeys(): Promise<any> {
    Preferences.configure({group: StorageService.groupPreferenceName})
    Preferences.keys().then((res: any) => {

    }).catch(err => {return err})
  }

  async clearStorage(): Promise<any> {
    Preferences.configure({group: StorageService.groupPreferenceName})
    Preferences.clear().then((res: any) => {

    }).catch(err => {return err})
  }
}
