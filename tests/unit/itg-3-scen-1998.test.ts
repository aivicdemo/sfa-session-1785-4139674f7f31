import { generateExecutiveProposal } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1998: リスク要因が0件のとき経営層向け説得資料生成がエラーになる', () => {
    // Arrange: AIRecommendationEngineをモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // モックの戻り値を設定（リスク要因が空配列）
    mockAIEngine.evaluatePatternRelevance.mockResolvedValue({
      riskFactors: [],
      proposalViability: 85,
      recommendedApproach: 'standard_proposal',
    });

    // 顧客情報と提案内容を準備
    const customerInfo = {
      companyName: 'Sample Corporation',
      industry: 'Technology',
      revenue: 5000000000,
      employeeCount: 500,
    };

    const proposalContent = {
      proposalId: 'PROP-2024-001',
      productName: 'Enterprise Solution',
      estimatedROI: 150,
      implementationCost: 2000000,
      implementationDays: 90,
    };

    // Act & Assert: リスク要因が0件のため、関数がエラーをスロー
    expect(() =>
      generateExecutiveProposal(customerInfo, proposalContent, mockAIEngine)
    ).toThrow(/リスク要因/);
  });
});