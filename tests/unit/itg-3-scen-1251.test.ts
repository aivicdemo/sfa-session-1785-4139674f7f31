import { evaluateProposalRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1251
  test('提案妥当性判定機能 - 参照される顧客ニーズが1件のときに判定ロジックが適切に処理される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(75)
    };

    const testCustomerNeeds = [
      {
        needId: 'NEED-001',
        category: 'コスト削減',
        description: 'システム運用コストの削減'
      }
    ];

    const proposalInput = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalContent: '自動化システムの導入によるコスト削減',
      customerNeeds: testCustomerNeeds
    };

    const result = evaluateProposalRelevance(
      proposalInput,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalContent: 'システムの導入によるコスト削減',
        needId: 'NEED-001',
        needCategory: 'コスト削減'
      })
    );

    expect(result.evaluationScore).toBe(75);
    expect(result.isRelevant).toBe(true);
    expect(result.confidence).toBe(0.75);
    expect(result.judgment).toBe('妥当');
  });
});