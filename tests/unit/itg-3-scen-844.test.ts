import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as it_1_br_3_3_2_1 from '../../src/logic/it-1-br-3-3-2-1';

// Mock for AIRecommendationEngine
interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock;
  findSimilarPatterns: jest.Mock;
  explainRecommendationReasoning: jest.Mock;
  evaluatePatternRelevance: jest.Mock;
}

describe('推奨内容の信頼度スコア算出・根拠提示機能', () => {
  let aiEngineStub: AIRecommendationEngineStub;

  beforeEach(() => {
    aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-844
  test('提案アプローチデータが null のとき、エラーで処理が進まない', async () => {
    // Arrange: AIエンジンスタブが提案アプローチデータとして null を返すよう設定
    aiEngineStub.generateRecommendation.mockResolvedValue(null);

    const recommendationRequest = {
      customerId: 'CUST-001',
      dealCondition: '新規営業案件',
      customerIndustry: 'IT',
      customerSize: 'large',
      proposalType: 'new_business',
    };

    // Act & Assert: エラーハンドリングが正常に実行されることを検証
    await expect(
      it_1_br_3_3_2_1.calculateConfidenceScoreWithReasoning(
        recommendationRequest,
        aiEngineStub
      )
    ).rejects.toThrow(/提案アプローチ/);
  });
});