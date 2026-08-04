import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジックの外部サービス呼び出し', () => {
  // SCEN-2698
  test('evaluatePatternRelevanceが0を返却したとき、その成功パターンは不適用と判定される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    const successPattern = {
      id: 'pattern-001',
      name: '成功パターンA',
      description: '大規模顧客への定期提案',
      customerSegment: 'enterprise',
      productCategory: 'solution',
      proposalApproach: '経営層向け説得資料を先行提示',
      successRate: 0.85,
    };

    const currentDealCondition = {
      customerId: 'cust-12345',
      customerSize: 'large',
      industry: 'finance',
      dealAmount: 5000000,
      dealStage: 'proposal_phase',
    };

    const result = evaluatePatternRelevance(
      successPattern,
      currentDealCondition,
      mockAIRecommendationEngine
    );

    expect(result.isApplicable).toBe(false);
    expect(result.relevanceScore).toBe(0);
    expect(result.applicabilityStatus).toBe('not_applicable');
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      successPattern,
      currentDealCondition
    );
  });
});