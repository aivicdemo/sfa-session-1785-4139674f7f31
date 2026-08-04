import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-580: 過去成功事例の参照件数が0件のとき事例ベースの根拠説明が省略される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客のデジタル変革支援提案',
        confidenceScore: 75,
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationInput = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'Manufacturing',
      customerScale: 'Large',
      dealAmount: 5000000,
      dealStage: 'Initial_Contact',
      recommendedApproach: '顧客のデジタル変革支援提案',
      confidenceScore: 75,
    };

    // Act
    const result = explainRecommendationReasoning(
      recommendationInput,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.explanation).toBeTruthy();
    expect(result.explanation).not.toMatch(/事例ベース/);
    expect(result.explanation).not.toMatch(/過去成功事例/);
    expect(result.explanation).not.toMatch(/類似案件/);
    expect(result.explanation).not.toMatch(/過去の事例では/);
    expect(result.explanation).toMatch(/以下の成功パターンに基づいて推奨します/);
    expect(result.similarCasesCount).toBe(0);
    expect(result.usesPatternMaster).toBe(true);
  });
});