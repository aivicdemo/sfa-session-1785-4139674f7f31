import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2104
  test('提案内容と標準プロセスの乖離度算出 - 営業担当者IDがnullのとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const salesRepId = null;
    const customerInfo = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '情報通信',
      scale: '中規模',
    };
    const dealCondition = {
      dealId: 'DEAL-001',
      dealTitle: '新規提案',
      proposalAmount: 5000000,
      expectedCloseDate: '2024-06-30',
    };
    const proposalContent = {
      proposalId: 'PROP-001',
      proposalSummary: 'クラウド導入支援',
      recommendedApproach: '段階的導入',
    };

    expect(() =>
      calculateProposalProcessDeviation(
        salesRepId,
        customerInfo,
        dealCondition,
        proposalContent,
        mockAIRecommendationEngine
      )
    ).toThrow(/営業担当者ID/);
  });
});