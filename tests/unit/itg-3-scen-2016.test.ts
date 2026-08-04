import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2016
  test('投資対効果スコアが閾値直上（81点）のとき、推奨判定が閾値超の結果になる', () => {
    // Arrange
    const customerInfo = {
      customerId: 'CUST-001',
      companyName: 'テスト会社',
      industry: '製造業',
      employeeCount: 150,
      annualRevenue: 5000000000,
    };

    const proposalContent = {
      proposalId: 'PROP-001',
      productName: 'ERP導入支援',
      estimatedCost: 50000000,
      expectedBenefit: 80000000,
      implementationPeriod: 6,
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        proposalId: 'PROP-001',
        recommendedAction: 'proceed_with_proposal',
        confidenceScore: 85,
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue(81),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去の類似案件から、本提案は実施推奨と判定されました'
      ),
    };

    // Act
    const result = generateRecommendation(customerInfo, proposalContent, mockAIRecommendationEngine);

    // Assert
    expect(result).toBeDefined();
    expect(result.investmentEffectivenessScore).toBe(81);
    expect(result.recommendationFlag).toBe('推奨対象');
    expect(result.recommendationStatus).toBe('実施推奨');
    expect(result.documentContent).toContain('推奨判定: 実施推奨');
    expect(result.documentContent).toContain('81点');
  });
});