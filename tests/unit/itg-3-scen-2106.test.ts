import { evaluateProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2106: [error] 提案内容と標準プロセスの乖離度算出 - 顧客対応パターンデータが null のとき、エラーが発生する', () => {
    const proposalId = 'PROP-001';
    const customerInfo = {
      customerId: 'CUST-001',
      industry: 'technology',
      scale: 'enterprise',
    };
    const dealConditions = {
      dealId: 'DEAL-001',
      stage: 'proposal',
      value: 500000,
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue(null),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      evaluateProposalDeviation(
        proposalId,
        customerInfo,
        dealConditions,
        mockAIRecommendationEngine
      );
    }).toThrow(/顧客対応パターンデータ/);
  });
});