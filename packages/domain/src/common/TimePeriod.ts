export class TimePeriod {
  readonly #startsAt: string;
  readonly #endsAt: string;

  constructor(startsAt: string, endsAt: string) {
    const startTime = Date.parse(startsAt);
    const endTime = Date.parse(endsAt);

    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
      throw new Error("TimePeriod boundaries must be valid date-time values.");
    }
    if (endTime < startTime) {
      throw new Error("TimePeriod end cannot be earlier than its start.");
    }

    this.#startsAt = new Date(startTime).toISOString();
    this.#endsAt = new Date(endTime).toISOString();
    Object.freeze(this);
  }

  get startsAt(): string {
    return this.#startsAt;
  }

  get endsAt(): string {
    return this.#endsAt;
  }

  contains(instant: string): boolean {
    const time = Date.parse(instant);
    if (!Number.isFinite(time)) {
      throw new Error("TimePeriod comparison requires a valid date-time value.");
    }

    return time >= Date.parse(this.#startsAt) && time <= Date.parse(this.#endsAt);
  }
}
