/**
 * Runtime Capability
 *
 * Every runtime engine implements this contract.
 */
export interface RuntimeCapability {
  /**
   * Globally unique capability name.
   */
  readonly name: string;

  /**
   * Semantic version.
   */
  readonly version: string;

  /**
   * Initializes the capability.
   */
  initialize(): Promise<void>;

  /**
   * Gracefully shuts down the capability.
   */
  shutdown(): Promise<void>;
}
