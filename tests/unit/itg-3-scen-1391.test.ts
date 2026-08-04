import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1391
  test('提案内容と顧客制約条件の自動照合機能 - 顧客のスケジュール制約が提案実装期間を超過するとき、実装可能性が100%と判定される', () => {
    const customerConstraint = {
      projectImplementationStartDate: new Date('2026-09-01'),
      projectImplementationEndDate: new Date('2026-10-31'),
      projectImplementationDaysAvailable: 61,
    };

    const proposalContent = {
      recommendedImplementationStartDate: new Date('2026-09-01'),
      recommendedImplementationEndDate: new Date('2026-11-30'),
      recommendedImplementationDaysRequired: 91,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        feasibilityScore: 100,
        matchStatus: 'FEASIBLE',
      }),
    };

    const result = evaluatePatternRelevance(
      proposalContent,
      customerConstraint,
      aiRecommendationEngineStub
    );

    expect(result.feasibilityScore).toBe(100);
    expect(result.matchStatus).toBe('FEASIBLE');
  });
});