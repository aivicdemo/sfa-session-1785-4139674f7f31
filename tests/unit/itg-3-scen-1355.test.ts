import { validateAndMatchProposalToCustomerConstraints } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1355
  test('顧客の経営目標が登録されていないとき照合処理がエラーになる', () => {
    // 準備: 顧客情報（経営目標なし）
    const customerId = 'CUST-2024-001';
    const customer = {
      id: customerId,
      name: '株式会社テスト',
      industry: '製造業',
      scale: 'LARGE',
      managementObjective: null, // 経営目標がNULL
      budgetLimit: 5000000,
      purchaseFrequency: 'QUARTERLY'
    };

    // 準備: 提案内容
    const proposalContent = {
      proposalId: 'PROP-2024-001',
      productModelNumber: 'MODEL-X500',
      proposedBudget: 3000000,
      implementationPeriodMonths: 3,
      expectedROI: 0.25
    };

    // 準備: AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 実行と検証: エラーが発生すること
    expect(() => {
      validateAndMatchProposalToCustomerConstraints(
        customer,
        proposalContent,
        mockAIEngine
      );
    }).toThrow(/経営目標/);
  });
});