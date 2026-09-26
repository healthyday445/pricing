// API placeholders for /forms/hormonal-care-plan-assessment.
// Answers are keyed by question id (see hormonalAssessmentQuestions.ts). Checkbox answers are string arrays;
// "Other" free text is sent under `${questionId}_other`.

export type AssessmentAnswers = Record<string, string | string[]>;

export interface AssessmentPayload {
    /** E.164, e.g. "+919876543210" */
    mobile: string;
    answers: AssessmentAnswers;
}

/**
 * Returns the student's earlier submission, or null if they haven't filled the form yet.
 * TODO: Replace with the real endpoint, e.g. GET /api/forms/hormonal-care-plan-assessment?mobile=...
 */
export async function fetchExistingSubmission(mobile: string): Promise<AssessmentAnswers | null> {
    console.log('[placeholder] fetchExistingSubmission', mobile);
    return null;
}

/**
 * Saves a new submission.
 * TODO: Replace with the real endpoint, e.g. POST /api/forms/hormonal-care-plan-assessment
 */
export async function submitAssessment(payload: AssessmentPayload): Promise<void> {
    console.log('[placeholder] submitAssessment', payload);
}
