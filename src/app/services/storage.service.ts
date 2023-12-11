import { Injectable } from '@angular/core';
import { GetResult, KeysResult, Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static readonly groupPreferenceName = 'DJPData'
  constructor() { }

  async setData(key: string, value: string): Promise<any> {
    await Preferences.configure({group: StorageService.groupPreferenceName})
    return await Preferences.set({key, value})
    .then((res: any) => {
      return true;
    }).catch(err => {return err})
  }

  async getData(key: string): Promise<string | null> {
    await Preferences.configure({group: StorageService.groupPreferenceName})
    console.log('key ', key);
    return await Preferences.get({key}).then((res: GetResult) => {
      console.log('res ', res);
      return res.value;
    }).catch(err => {return err})
  }

  async removeData(key: string): Promise<boolean | any> {
    await Preferences.configure({group: StorageService.groupPreferenceName})
    return await Preferences.remove({key}).then((res: any) => {
      return true;
    }).catch(err => {return err})
  }

  async getStorageKeys(): Promise<KeysResult> {
    await Preferences.configure({group: StorageService.groupPreferenceName})
    return await Preferences.keys().then((res: KeysResult) => {
      return res;
    }).catch(err => {return err})
  }

  async clearStorage(): Promise<any> {
    await Preferences.configure({group: StorageService.groupPreferenceName})
    await Preferences.clear().then((res: any) => {
      return true;
    }).catch(err => {return err})
  }
}
