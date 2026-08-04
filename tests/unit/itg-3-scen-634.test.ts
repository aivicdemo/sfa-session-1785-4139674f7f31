import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-634
  test('推奨根拠レコードが0件のとき、エラーメッセージを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealId = 'DEAL-20250801-001';
    const customerInfo = {
      customerId: 'CUST-001',
      name: 'テスト顧客株式会社',
      industry: '製造業',
      scale: '中堅企業',
    };

    const result = visualizeRecommendationReasoning(
      dealId,
      customerInfo,
      mockAIEngine
    );

    expect(result.status).toBe('error');
    expect(result.code).toBe('NO_REASONING_RECORDS');
    expect(result.message).toBe(
      '推奨根拠が見つかりません。過去の類似案件データが不足しています。営業担当者に相談してください'
    );
    expect(result.statusCode).toBe(400);
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
  });
});