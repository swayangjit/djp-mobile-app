import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, CapacitorSQLitePlugin } from '@capacitor-community/sqlite';
import { dbinfo } from '../../appConstants';
import { TelemetryConfigEntry } from './telemetrySchema';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  sqliteConnection!: SQLiteConnection;
  sqliteDBConnection!: SQLiteDBConnection;
  sqlitePlugin!: CapacitorSQLitePlugin;
  dbname!: string;
  constructor() { }

  // Initilaise sqlite database
  async initializePlugin(): Promise<boolean> {
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    await this.openDatabase(dbinfo.dbName, false, "no-encryption", dbinfo.version, false);
    await this.createTable(TelemetryConfigEntry.getCreateEntry());
    return true;
  }

  // opem database
  async openDatabase(dbName:string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<boolean> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;
    if(retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection.createConnection(dbName, encrypted, mode, version, readonly);
    }
    await db.open();
    this.sqliteDBConnection = db;
    return true;
  }

  // close db connection
  async closeConnection(database:string, readonly?: boolean): Promise<void> {
    const readOnly = readonly ? readonly : false;
    return await this.sqliteConnection.closeConnection(database, readOnly);
  }

  async createTable(stmt: string): Promise<any> {
    try {
      const retValues = (await this.sqliteDBConnection.query(stmt)).values;
      console.log('retValues ', retValues);
      const ret = retValues!.length > 0 ? retValues! : null;
      return ret;
    } catch(err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`create table err: ${msg}`);
    }
  }
  
  async readDbData(stmt: string, where?: any): Promise<any> {
    try {
        if(where) {
          const key: string = Object.keys(where)[0];
          const q: string = `${stmt} WHERE ${key}=${where[key]};`;
          const retValues = (await this.sqliteDBConnection.query(q)).values;
          const ret = retValues!.length > 0 ? retValues! : null;
          return ret;
        } else {
          const retValues = (await this.sqliteDBConnection.query(stmt)).values;
          const ret = retValues!.length > 0 ? retValues![0] : null;
          return ret;
        }
    } catch(err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`readDbData err: ${msg}`);
    }
  }

  async save(query: string, mObj: any, where?: any): Promise<void> {
      const isUpdate: boolean = where ? true : false;
      const keys: string[] = Object.keys(mObj);
      let stmt: string = '';
      let values: any[] = [];
      for (const key of keys) {
        values.push(mObj[key]);
      }
      if(!isUpdate) {
        // INSERT
        const qMarks: string[] = [];
        for (const key of keys) {
          qMarks.push('?');
        }
        stmt = `${query} (${keys.toString()}) VALUES (${qMarks.toString()});`;
      } else {
        // UPDATE
        const wKey: string = Object.keys(where)[0];

        const setString: string = await this.setNameForUpdate(keys);
        if(setString.length === 0) {
          return Promise.reject(`save: update no SET`);
        }
        stmt = `${query} ${setString} WHERE ${wKey}=${where[wKey]}`;
      }
      const ret = await this.sqliteDBConnection.run(stmt,values);
      if(ret.changes!.changes != 1) {
        return Promise.reject(`save: insert changes != 1`);
      }
      return;
  }

  // delete data from table
  async remove(query: string, where: any): Promise<any> {
    const key: string = Object.keys(where)[0];
    const stmt: string = `${query} ${key}=${where[key]};`
    const ret = (await this.sqliteDBConnection.run(stmt)).changes;
    return ret;
  }

  /**
   * SetNameForUpdate
   * @param names
   */
  private async setNameForUpdate(names: string[]): Promise<string> {
    let retString = '';
    for (const name of names) {
      retString += `${name} = ? ,`;
    }
    if (retString.length > 1) {
      retString = retString.slice(0, -1);
      return retString;
    } else {
      return Promise.reject('SetNameForUpdate: length = 0');
    }
  }
}

