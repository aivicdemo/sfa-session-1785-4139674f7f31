import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1849
  test('推奨数量が負数のとき根拠情報の生成に失敗する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      deal_id: 'DEAL-20240115-001',
      customer_id: 'CUST-12345',
      customer_name: '株式会社テスト',
      industry: 'IT',
      company_size: '中企業',
      current_challenge: 'システム最適化',
      recommended_quantity: -5,
      recommended_timing: '2024-01-20',
      recommended_approach: 'エンタープライズプラン提案',
    };

    const result = explainRecommendationReasoning(newDealData, mockAIEngine);

    expect(result).toEqual({
      success: false,
      reasoning: null,
      error_message: '推奨数量は正の整数である必要があります',
    });

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});