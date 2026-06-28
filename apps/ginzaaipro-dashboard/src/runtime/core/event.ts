/**
 * RuntimeEvent
 *
 * Represents an event produced by the Runtime Kernel.
 *
 * Runtime Events describe platform reality, not business reality.
 */
export interface RuntimeEvent {
  /**
   * Event identifier.
   */
  id: string;

  /**
   * Event type.
   */
  type: string;

  /**
   * UTC timestamp.
   */
  timestamp: string;

  /**
   * Runtime trace identifier.
   */
  traceId?: string;

  /**
   * Optional capability responsible for the event.
   */
  capability?: string;

  /**
   * Severity of the runtime event.
   */
  severity: "Info" | "Warning" | "Error" | "Critical";

  /**
   * Optional diagnostic message.
   */
  message?: string;
}
