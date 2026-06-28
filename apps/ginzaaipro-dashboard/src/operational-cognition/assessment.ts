import type { OperationalAssessment } from "./types";

/**
 * OperationalAssessmentModel
 *
 * Immutable representation of a completed
 * operational assessment.
 */
export class OperationalAssessmentModel {
  constructor(private readonly assessment: OperationalAssessment) {}

  get id(): string {
    return this.assessment.id;
  }

  get category() {
    return this.assessment.category;
  }

  get finding(): string {
    return this.assessment.finding;
  }

  get severity() {
    return this.assessment.severity;
  }

  get confidence() {
    return this.assessment.confidence;
  }

  get evidence() {
    return this.assessment.evidence;
  }

  get recommendation() {
    return this.assessment.recommendation;
  }

  get createdAt() {
    return this.assessment.createdAt;
  }

  toJSON(): OperationalAssessment {
    return this.assessment;
  }
}
