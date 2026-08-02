import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { validateDataQualityAndDecidePriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-186
  test('検証結果の重度度スコアが空のとき、優先度決定がスキップされる', () => {
    const mockPriorityDecisionProcess = jest.fn();

    const validationResultWithNullSeverity = {
      id: 'validation-001',
      severityScore: null,
      priority: undefined,
      issues: [],
    };

    const validationResultWithUndefinedSeverity = {
      id: 'validation-002',
      severityScore: undefined,
      priority: undefined,
      issues: [],
    };

    // null の場合
    validateDataQualityAndDecidePriority(
      validationResultWithNullSeverity,
      mockPriorityDecisionProcess
    );

    expect(mockPriorityDecisionProcess).not.toHaveBeenCalled();
    expect(validationResultWithNullSeverity.priority).toBeUndefined();

    // undefined の場合
    mockPriorityDecisionProcess.mockClear();

    validateDataQualityAndDecidePriority(
      validationResultWithUndefinedSeverity,
      mockPriorityDecisionProcess
    );

    expect(mockPriorityDecisionProcess).not.toHaveBeenCalled();
    expect(validationResultWithUndefinedSeverity.priority).toBeUndefined();
  });
});