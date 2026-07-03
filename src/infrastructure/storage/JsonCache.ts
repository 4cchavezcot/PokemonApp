import { KeyValueStorage } from './KeyValueStorage';

interface CacheEnvelope<T> {
  savedAt: number;
  value: T;
}

export interface CachedEntry<T> {
  value: T;
  isFresh: boolean;
}

export class JsonCache {
  constructor(
    private readonly storage: KeyValueStorage,
    private readonly ttlMilliseconds: number,
    private readonly now: () => number = Date.now,
  ) {}

  async read<T>(key: string): Promise<CachedEntry<T> | null> {
    try {
      const raw = await this.storage.getItem(key);
      if (raw === null) return null;
      const envelope = JSON.parse(raw) as CacheEnvelope<T>;
      const isFresh = this.now() - envelope.savedAt < this.ttlMilliseconds;
      return { value: envelope.value, isFresh };
    } catch {
      return null;
    }
  }

  async write<T>(key: string, value: T): Promise<void> {
    try {
      const envelope: CacheEnvelope<T> = { savedAt: this.now(), value };
      await this.storage.setItem(key, JSON.stringify(envelope));
    } catch {
    }
  }
}
