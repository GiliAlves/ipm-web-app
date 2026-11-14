import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
/**
 * Serviço de abstração do `@ionic/storage-angular`.
 *
 * Fornece métodos para criar, ler, salvar, remover e limpar dados persistentes
 * no dispositivo, com tratamento básico de erros via Toast.
 */
export class StorageService {

  /** Instância interna do storage do Ionic. */
  private _storage: Storage | null = null;

  constructor(
    private toastController: ToastController,
    private storage: Storage) { }

  /**
   * Inicializa o engine de storage.
   * @returns Instância de storage criada.
   */
  public create = async () => this._storage = await this.storage.create();

  /**
   * Recupera um valor pelo chave.
   * @param key - Chave do valor armazenado.
   * @returns Valor armazenado ou `null` em caso de erro.
   */
  async get(key: string) {
		try {
			return this.storage.get(key);
		} catch (err) {
			this.presentToast(`Error getting stored data: ${err}`);
			return null;
		}
	}

  /**
   * Armazena um valor pela chave.
   * @param key - Chave de identificação.
   * @param value - Valor a ser armazenado.
   * @returns `true` se o armazenamento foi bem-sucedido, `false` caso contrário.
   */
  public set(key: string, value: unknown) {
    try {
      this._storage?.set(key, value)
      return true
    } catch (err) {
      this.presentToast(`Error storing data: ${err}`);
      return false;
    }
  }

  /**
   * Remove todos os dados armazenados.
   */
  public clear = async () => (await this._storage?.clear());

  /**
   * Remove um valor específico pelo chave.
   * @param key - Chave do valor a ser removido.
   */
  public remove = async (key: string) => (await this._storage?.remove(key));

  private encryptedValue = (value: unknown) => btoa(escape(JSON.stringify(value)));

  private unEncryptedValue = (value: string) => JSON.parse(unescape(atob(value)));

  private async presentToast(message: string, duration = 200, position: 'top' | 'middle' | 'bottom' = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }
}
