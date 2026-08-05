import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { validateSuccessPatternGuidelineCompletionWithMissingSubmissionDatetime } from '../../src/logic/it-1-br-2-1-1';

describe('Success Pattern Guideline Completion Judgment - Missing Submission Datetime', () => {
  // SCEN-1028: [error] 成功パターン適用ガイドライン周知完了判定機能 - 実務適用報告提出日時が欠落しているとき処理がエラーになること
  it('should throw error with code MISSING_SUBMISSION_DATETIME when submissionDatetime is null', () => {
    const input = {
      guidelineNotificationDate: new Date('2024-01-15T09:00:00Z'),
      targetDepartment: '営業第1部',
      applicationReportSubmissionDatetime: null,
      guidanceDocumentId: 'DOC-2024-001',
      acknowledgedBy: 'user123'
    };

    expect(() => 
      validateSuccessPatternGuidelineCompletionWithMissingSubmissionDatetime(input)
    ).toThrow(/実務適用報告提出日時/);
  });
});