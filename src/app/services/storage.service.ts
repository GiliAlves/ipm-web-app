import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(
    private toastController: ToastController,
    private storage: Storage) { }

  public create = async () => this._storage = await this.storage.create();

  async get(key: string) {
		try {
			return this.storage.get(key);
		} catch (err) {
			this.presentToast(`Error getting stored data: ${err}`);
			return null;
		}
	}

  public set(key: string, value: any) {
    try {
      this._storage?.set(key, value)
      return true
    } catch (err) {
      this.presentToast(`Error storing data: ${err}`);
      return false;
    }
  }

  public clear = async () => (await this._storage?.clear());

  public remove = async (key: string) => (await this._storage?.remove(key));

  private encryptedValue = (value: any) => btoa(escape(JSON.stringify(value)));

  private unEncryptedValue = (value: any) => JSON.parse(unescape(atob(value)));

  private async presentToast(message: string, duration = 200, position: 'top' | 'middle' | 'bottom' = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }
}
