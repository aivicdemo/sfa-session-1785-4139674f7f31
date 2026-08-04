import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1265: [edge] 提案妥当性判定機能 - 営業プロセスが要件を満たすが顧客ニーズが満たさない場合に改善指摘が出力される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        processRequirementScore: 0.95,
        customerNeedsScore: 0.45,
      }),
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客ニーズを基盤とした段階的提案',
        improvementAdvice: [
          {
            adviceType: 'CUSTOMER_NEEDS_GAP',
            category: '需要創出',
            description: '顧客のニーズ分析が不十分です。導入時期と予算検討について詳細なヒアリングを実施してください',
            priority: 'HIGH',
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '顧客のニーズ分析が不十分です。導入時期と予算検討について詳細なヒアリングを実施してください'
      ),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const input = {
      saleProjectId: 'TEST-20260801',
      processChecklistCompleted: true,
      customerNeedsAnalysis: {
        issueCognitionLevel: 'LOW',
        budgetReviewStatus: 'NOT_EXECUTED',
        implementationTiming: 'UNDEFINED',
      },
      aiRecommendationEngine: mockAIRecommendationEngine,
    };

    return evaluateProposalAppropriateness(input).then((result) => {
      expect(result.judgmentResult.judgmentStatus).toBe('CONDITIONAL_APPROVAL');
      expect(result.judgmentResult.processRequirementMet).toBe(true);
      expect(result.judgmentResult.customerNeedsMet).toBe(false);

      expect(Array.isArray(result.improvementAdvice)).toBe(true);
      expect(result.improvementAdvice.length).toBeGreaterThanOrEqual(1);

      const firstAdvice = result.improvementAdvice[0];
      expect(firstAdvice.adviceType).toBe('CUSTOMER_NEEDS_GAP');
      expect(firstAdvice.category).toBe('需要創出');
      expect(firstAdvice.description).toBe(
        '顧客のニーズ分析が不十分です。導入時期と予算検討について詳細なヒアリングを実施してください'
      );
      expect(firstAdvice.priority).toBe('HIGH');
    });
  });
});