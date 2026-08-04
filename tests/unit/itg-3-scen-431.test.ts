import { decideCounselingDirection } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  // SCEN-431
  test('改善対象項目が0件の場合、方針に該当項目が含まれない', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockImproveTargetItems: string[] = [];

    const inputCaseData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      proposalApproach: 'cost_reduction',
      previousOutcomes: [
        {
          dealId: 'DEAL-2023-001',
          customerId: 'CUST-2023-001',
          success: true,
          approachUsed: 'cost_reduction',
        },
      ],
    };

    const result = decideCounselingDirection(
      inputCaseData,
      mockImproveTargetItems,
      mockAIRecommendationEngine
    );

    expect(result).toHaveProperty('improvementTargetItems');
    expect(result.improvementTargetItems).toEqual([]);

    expect(result).toHaveProperty('applicableCounselingPolicies');
    expect(result.applicableCounselingPolicies).toEqual([]);

    expect(result).toHaveProperty('directionGenerationLog');
    expect(result.directionGenerationLog).toMatch(
      /改善対象項目なし|フィルタリングスキップ/
    );

    expect(result).toHaveProperty('counceling_policies_list');
    const policiesList = result.counceling_policies_list as Array<{
      policy_id: string;
      name: string;
    }>;
    const hasFilteredPolicies = policiesList.some(
      (p) =>
        p.name.includes('改善対象') || p.policy_id.includes('improvement_target')
    );
    expect(hasFilteredPolicies).toBe(false);
  });
});