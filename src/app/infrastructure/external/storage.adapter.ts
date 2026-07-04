import { Injectable } from '@angular/core';
import { IStorageService } from '../../core/domain/ports';
import { StorageService } from '../../services/storage.service';

/**
 * Adapter do Ionic Storage para a port IStorageService.
 */
@Injectable({ providedIn: 'root' })
export class IonicStorageAdapter implements IStorageService {
  constructor(private readonly storage: StorageService) {}

  async get<T>(key: string): Promise<T | null> {
    return this.storage.get(key) as Promise<T | null>;
  }

  async set<T>(key: string, value: T): Promise<T> {
    this.storage.set(key, value);
    return value;
  }

  async remove(key: string): Promise<void> {
    await this.storage.remove(key);
  }
}
