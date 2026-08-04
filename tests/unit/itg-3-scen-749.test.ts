import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  test('SCEN-749: 企業規模が null のとき、推奨生成不可と判定される', () => {
    // Arrange: AIRecommendationEngine のスタブを作成
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'mock proposal',
        confidenceScore: 85,
        reasoning: 'mock reasoning',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 企業規模が null で、他の必須フィールドは有効な顧客データ
    const customerData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      companySizeLevel: null, // 企業規模が null
      annualRevenue: 50000000,
      contactDate: '2024-01-15T10:00:00Z',
    };

    // Act: 顧客データ完全性・妥当性判定を実行
    const result = validateCustomerDataCompleteness(customerData, mockAIEngine);

    // Assert: 推奨生成不可と判定される
    expect(result.isCandidateForRecommendation).toBe(false);

    // Assert: AIRecommendationEngine.generateRecommendation が呼び出されないこと
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();

    // Assert: エラーメッセージまたは不完全データ警告が含まれること
    expect(result.validationMessage).toMatch(/企業規模|companySizeLevel/);

    // Assert: 推奨結果は null または空値であること
    expect(result.recommendationResult).toBeNull();
  });
});