import { TraceEvent } from "../../types";

export type EventCallback = (payload: any) => void | Promise<void>;

/**
 * Asynchronous event coordinator for AI Commerce OS high-frequency pipelines.
 */
export class EventCoordinator {
  private static instance: EventCoordinator;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private auditLog: any[] = [];

  private constructor() {}

  public static getInstance(): EventCoordinator {
    if (!EventCoordinator.instance) {
      EventCoordinator.instance = new EventCoordinator();
    }
    return EventCoordinator.instance;
  }

  /**
   * Subscribe to a custom commerce execution topic
   */
  public subscribe(topic: string, cb: EventCallback): void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(cb);
  }

  /**
   * Unsubscribe from a custom commerce topic
   */
  public unsubscribe(topic: string, cb: EventCallback): void {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic)!.delete(cb);
    }
  }

  /**
   * Publish asynchronous event throughout the multi-agent system
   */
  public async publish(topic: string, payload: any): Promise<void> {
    const eventRecord = {
      topic,
      timestamp: new Date().toISOString(),
      payload
    };
    this.auditLog.push(eventRecord);

    const topicListeners = this.listeners.get(topic);
    if (topicListeners) {
      const promises = Array.from(topicListeners).map(listener => {
        try {
          return Promise.resolve(listener(payload));
        } catch (err) {
          console.error(`[EventCoordinator] Error dispatching event to subscriber of [${topic}]:`, err);
        }
      });
      await Promise.all(promises);
    }
  }

  /**
   * Query the foundation runtime audit logs
   */
  public getAuditHistory() {
    return this.auditLog;
  }
}
