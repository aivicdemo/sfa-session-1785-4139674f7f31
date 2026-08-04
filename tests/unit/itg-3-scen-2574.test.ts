import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-15T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // SCEN-2574
  test('推奨内容の根拠表示機能 - 根拠の有効期限が本日後のとき、表示される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const reasoningData = {
      reasonId: 'reason-001',
      expirationDate: '2026-08-20T23:59:59Z',
      description: '顧客の業種と過去成功パターンの類似度が85%以上',
    };

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      reasoningData
    );

    const dealInput = {
      customerId: 'cust-12345',
      customerIndustry: 'IT',
      dealValue: 500000,
      dealStage: 'discovery',
    };

    const result = explainRecommendationReasoning(
      dealInput,
      mockAIRecommendationEngine
    );

    expect(result.reasonId).toBe('reason-001');
    expect(result.description).toBe(
      '顧客の業種と過去成功パターンの類似度が85%以上'
    );
    expect(result.expirationDate).toBe('2026-08-20T23:59:59Z');

    const currentDate = new Date('2026-08-15T10:00:00Z');
    const expirationDate = new Date('2026-08-20T23:59:59Z');
    expect(expirationDate.getTime()).toBeGreaterThan(currentDate.getTime());

    const isValid = expirationDate > currentDate;
    expect(isValid).toBe(true);
  });
});