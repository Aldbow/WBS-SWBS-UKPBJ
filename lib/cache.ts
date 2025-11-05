// Simple in-memory cache for client-side (using localStorage as a fallback)
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private localStorageKey = 'swbs_cache';

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert object back to Map
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      // Reset cache if there's an error
      this.cache.clear();
    }
  }

  private saveToLocalStorage() {
    try {
      // Convert Map to object for JSON serialization
      const obj: Record<string, CacheEntry> = {};
      this.cache.forEach((value, key) => {
        obj[key] = value;
      });
      localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if entry is expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.saveToLocalStorage();
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.saveToLocalStorage();
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.saveToLocalStorage();
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem(this.localStorageKey);
  }

  // Clean expired entries
  clean(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    // Use Array.from to convert the iterator to an array for better compatibility
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }
    for (const key of expiredKeys) {
      this.cache.delete(key);
    }
    this.saveToLocalStorage();
  }
}

export const cache = new SimpleCache();