/**
 * Highly optimized caching database for multi-agent tokens, LLM structured schemas, and static analytics.
 * Avoids redundant Gemini calls for similar state checks.
 */
export class CognitiveCacheStore {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  /**
   * Put value with TTL in milliseconds (default 5 minutes)
   */
  public set(key: string, value: any, ttlMs: number = 300000): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Retrieve unexpired cached value
   */
  public get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Invalidate specific key
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Flush all historical memory traces or simulation snapshots
   */
  public clear(): void {
    this.cache.clear();
  }
}
