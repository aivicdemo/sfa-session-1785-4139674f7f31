import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1210
  test('提案がまだ営業担当者による確認・修正段階にあるとき、エラーを返す', () => {
    const proposalId = 'PROP-2024-001';
    const proposalStatus = 'UNDER_REVIEW';

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockProposal = {
      id: proposalId,
      status: proposalStatus,
      content: 'Sample proposal content',
      customerId: 'CUST-001',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() => {
      evaluateProposalValidity(mockProposal, mockAIEngine);
    }).toThrow(/PROPOSAL_STATUS_INVALID/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});