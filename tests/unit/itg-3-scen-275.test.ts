import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨アプローチ推奨機能 - 過去成功事例0件かつ外部API失敗時の代替動作', () => {
  test('SCEN-275: 外部API失敗と類似事例0件のとき、推奨パターンマスタの最小単位パターンが返される', () => {
    // Arrange: AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]), // 類似成功事例0件
      generateRecommendation: jest
        .fn()
        .mockRejectedValue(new Error('OpenAI API timeout')), // 外部API失敗
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタの最小単位パターン定義
    const minimalPatternMaster = {
      patternId: 'MIN_PATTERN_001',
      patternName: '基本提案フロー',
      description: '標準的な顧客ニーズヒアリング→課題整理→初期提案の3ステップフロー',
    };

    // 新規案件の顧客・商談条件
    const dealInput = {
      customerId: 'CUST_NEW_001',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      businessIssue: 'コスト削減',
      dealStage: 'initial_contact',
      budget: 5000000,
      decisionTimeline: '2024-Q2',
    };

    // Act: generateRecommendationメソッド呼び出し
    const result = generateRecommendation(dealInput, mockAIEngine, [minimalPatternMaster]);

    // Assert: 外部API失敗時に推奨パターンマスタから最小単位パターンが返されることを確認
    expect(result).toEqual({
      recommendedPatternId: 'MIN_PATTERN_001',
      recommendedPatternName: '基本提案フロー',
      recommendationDescription:
        '標準的な顧客ニーズヒアリング→課題整理→初期提案の3ステップフロー',
      reasoning: '内部パターンマスタから推奨されました',
      confidenceScore: 45,
      isAlternativeRecommendation: true,
      cacheFlagOrFallbackIndicator: 'FALLBACK_FROM_PATTERN_MASTER',
    });

    // Assert: 外部AIエンジンへの呼び出し試行を確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(dealInput);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealInput);
  });
});