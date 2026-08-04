import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { evaluatePrecisionWithSinglePattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let mockAIRecommendationEngine: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-397
  test('推論精度検証機能 - 検証実行時点での比較成功パターンが1件のとき、その1件を基準に精度判定を実行', () => {
    // Arrange: AIRecommendationEngine.findSimilarPatterns をスタブ化
    const singlePatternResponse = {
      patternId: 'PAT-001',
      matchScore: 0.92,
      successMetrics: {
        closureRate: 0.85,
        avgDealSize: 2500000,
        timeToClose: 45,
      },
    };

    mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([singlePatternResponse]),
    };

    const newDealInput = {
      customerId: 'CUST-123',
      dealValue: 2400000,
      industry: 'Manufacturing',
      dealCycle: 40,
    };

    // Act: 推論精度判定ロジックを実行
    const precisionResult = evaluatePrecisionWithSinglePattern(
      newDealInput,
      mockAIRecommendationEngine
    );

    // Assert: 返却された精度判定結果の構造と値を検証
    expect(precisionResult.baselinePatternId).toBe('PAT-001');
    expect(precisionResult.precisionScore).toBe(0.92);
    expect(precisionResult.confidenceLevel).toBe('high');
    expect(precisionResult.evaluationBasis).toBe('single_pattern_comparison');
    expect(precisionResult.recommendedApproach).toBeDefined();
    expect(precisionResult.recommendedApproach.strategy).toBe('既存成功パターンの適用');
    expect(precisionResult.recommendedApproach.reasoning).toBe(
      'matchScore 0.92により類似度が高い'
    );
  });
});