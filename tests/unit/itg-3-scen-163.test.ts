import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-163
  test('根拠情報が0件の場合、簡略版の説明文を返却する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerId: 'CUST-001',
      customerIndustry: 'IT',
      customerScale: 'large',
      productCategory: 'consulting',
      dealValue: 5000000,
      dealStage: 'proposal',
    };

    const recommendationContent = {
      proposalApproach: 'digital_transformation',
      recommendedActions: [
        'executive_meeting',
        'pilot_project',
      ],
      estimatedSuccessProbability: 0.65,
    };

    const result = explainRecommendationReasoning(
      dealCondition,
      recommendationContent,
      mockAIEngine,
    );

    const expectedExplanation =
      '類似した過去成功事例が見つかりませんでしたため、推奨パターンマスタの統計的上位パターンに基づいた提案を行っています。詳細な根拠については営業担当者にご相談ください。';

    expect(result).toBe(expectedExplanation);
    expect(result.length).toBeGreaterThanOrEqual(40);
    expect(result.length).toBeLessThanOrEqual(200);
    expect(result).not.toBe(null);
    expect(result).not.toBe(undefined);
    expect(result).not.toBe('');
  });
});