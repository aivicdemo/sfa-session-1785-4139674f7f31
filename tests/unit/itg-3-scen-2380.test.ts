import { evaluateInferencePrecisionWithMissingElements } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2380
  test('営業担当者の提案内容の欠落がある場合、その欠落部分を考慮した精度スコアが算出される', () => {
    const salesProposalData = {
      customerChallenge: '既存システムの老朽化による業務効率低下',
      proposalSolution: 'クラウドベースの統合管理システム導入',
      implementationEffect: null,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        completenessScore: 0.67,
        missingElementImpact: 0.15,
        baselineScore: 0.85,
      }),
    };

    const result = evaluateInferencePrecisionWithMissingElements(
      salesProposalData,
      mockAIRecommendationEngine
    );

    expect(result.precisionScore).toBe(0.70);
    expect(result.details).toEqual({
      missingElements: ['導入効果'],
      impactPercentage: -15,
    });
  });
});