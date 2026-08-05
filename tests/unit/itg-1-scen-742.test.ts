import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateAIInferencePrecisionScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let errorLogSpy: jest.SpyInstance;

  beforeEach(() => {
    errorLogSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorLogSpy.mockRestore();
  });

  // SCEN-742
  test('提案内容がnullの場合にエラーをスロー', () => {
    const input = {
      proposalContent: null,
      standardProcessCompliance: 0.85,
      customerResponseScore: 0.90,
      successPatternMatchRate: 0.78,
    };

    expect(() => calculateAIInferencePrecisionScore(input)).toThrow(/営業担当者の提案内容/);
    expect(errorLogSpy).toHaveBeenCalled();
    const loggedError = errorLogSpy.mock.calls[0][0];
    expect(loggedError).toMatch(/PROPOSAL_CONTENT_NULL_ERROR/);
  });
});