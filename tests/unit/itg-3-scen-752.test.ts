import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-752
  test('[edge] 顧客データ完全性・妥当性判定機能 - 過去成功パターンマスタが0件のとき、推奨生成不可と判定される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社サンプル',
      industry: '製造業',
      companySize: '中堅企業',
      businessChallenge: 'デジタル化推進',
      dealAmount: 5000000,
      dealStage: '初期接触',
      proposalType: 'コンサルティング',
    };

    // Act
    const result = validateCustomerDataCompleteness(
      newCaseData,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.status).toBe('推奨生成不可');
    expect(result.detailedMessage).toContain(
      '過去成功パターンが存在しないため、推奨を生成することができません'
    );
    expect(result.recommendationContent).toBeNull();
    expect(result.reasoningExplanation).toBeNull();
    expect(result.downloadUrl).toBeNull();
    expect(result.rootCauseData).toEqual([]);
    expect(result.successPatterns).toEqual([]);
  });
});