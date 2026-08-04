import { analyzeProposalPatternAndCustomerResponse } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2264
  test('標準プロセス定義が存在しないとき、比較処理がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE001',
          customerType: 'enterprise',
          proposalApproach: 'consultative_sell',
          successRate: 0.92,
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const proposalInput = {
      proposalId: 'PROP20240115001',
      customerId: 'CUST001',
      proposalContent: {
        productCategory: 'cloud_service',
        implementationPeriod: 6,
        investmentAmount: 5000000,
      },
      customerResponsePattern: {
        initialContactResponse: 'positive',
        documentReviewDays: 7,
        internalApprovalCycles: 2,
        decisionMakerEngagement: 'active',
      },
    };

    const standardProcessDefinition = null;

    expect(() => {
      analyzeProposalPatternAndCustomerResponse(
        proposalInput,
        standardProcessDefinition,
        mockAIEngine
      );
    }).toThrow(/標準プロセス定義/);
  });
});