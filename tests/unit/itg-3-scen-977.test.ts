import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

// Mock AIRecommendationEngine
jest.mock('../../src/external/AIRecommendationEngine', () => ({
  AIRecommendationEngine: jest.fn().mockImplementation(() => ({
    evaluatePatternRelevance: jest.fn(),
    generateRecommendation: jest.fn(),
    findSimilarPatterns: jest.fn(),
    explainRecommendationReasoning: jest.fn(),
  })),
}));

describe('推奨内容の根拠表示機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-977
  test('[error] 成功パターンの適用可能度スコアが 1.0 を超過するとき、不正値エラーが返される', () => {
    const { AIRecommendationEngine } = require('../../src/external/AIRecommendationEngine');
    const mockEngine = new AIRecommendationEngine();

    // 適用可能度スコアとして 1.01 を返すよう設定
    mockEngine.evaluatePatternRelevance.mockResolvedValue({
      relevanceScore: 1.01,
      applicablePatterns: [
        {
          patternId: 'SUCCESS_PATTERN_001',
          patternName: '大規模企業向け長期契約パターン',
          relevanceScore: 1.01,
        },
      ],
    });

    // テスト対象の関数に入力
    const newDealData = {
      customerId: 'CUST_12345',
      customerName: '株式会社テスト',
      industry: '製造業',
      companySize: 'LARGE',
      dealAmount: 5000000,
      dealStage: 'PROPOSAL',
      dealConditions: {
        budget: 5000000,
        timeline: '2024-Q3',
        decisionMaker: 'CFO',
        priority: 'HIGH',
      },
    };

    // 推奨内容の根拠表示処理を実行
    const result = displayRecommendationReasoning(newDealData, mockEngine);

    // 返却されたレスポンスを確認
    expect(result).toEqual(
      expect.objectContaining({
        statusCode: 400,
        errorCode: 'INVALID_RELEVANCE_SCORE',
        errorMessage: '適用可能度スコアは 0.0 以上 1.0 以下の範囲で指定してください。受け取った値: 1.01',
      })
    );

    // 外部AI API（OpenAI）への実際の呼び出しが行われていないことを確認
    expect(mockEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});