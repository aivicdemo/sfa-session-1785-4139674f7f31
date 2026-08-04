import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性スコア判定機能', () => {
  // SCEN-139
  test('適用可能性スコアが許可ライン直下で推論が保留される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0.69,
        isRelevant: false,
      }),
    };

    const dealCondition = {
      industryType: 'IT企業',
      budget: 5000000,
      implementationPeriodMonths: 3,
    };

    const thresholdScore = 0.70;

    const result = evaluatePatternRelevance(
      dealCondition,
      mockAIEngine,
      thresholdScore
    );

    expect(result).toEqual({
      inferenceStatus: 'PENDING',
      recommendationGenerated: false,
      userMessage:
        'このパターンは参考情報です。営業担当者の判断を優先してください',
      internalLog:
        'PatternRelevanceScore: 0.69 | Status: BELOW_THRESHOLD | Action: HOLD_FOR_MANUAL_REVIEW',
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
  });
});