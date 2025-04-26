/* eslint-disable @typescript-eslint/no-unsafe-function-type */
class EventBus {
  private static instance: EventBus;
  private eventMap: Map<string, Function[]>;

  private constructor() {
    this.eventMap = new Map();
  }

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: string, callback: Function) {
    const callbacks = this.eventMap.get(event) || [];
    callbacks.push(callback);
    this.eventMap.set(event, callbacks);
  }

  off(event: string, callback: Function) {
    const callbacks = this.eventMap.get(event) || [];
    this.eventMap.set(
      event,
      callbacks.filter(cb => cb !== callback)
    );
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.eventMap.get(event) || [];
    callbacks.forEach(cb => cb(...args));
  }
}
/**
 * 事件总线
 */
export const eventBus = EventBus.getInstance();
