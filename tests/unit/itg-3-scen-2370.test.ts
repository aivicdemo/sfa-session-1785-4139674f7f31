import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2370
  test('同一の提案内容と顧客対応パターンデータで2回実行したとき、同じスコアが算出される', () => {
    const customerPatternData = {
      industry: '製造業',
      budgetScale: 50000000,
      implementationPeriodMonths: 6,
      decisionMakerCount: 3,
    };

    const proposalContentData = {
      product: 'クラウドERP',
      approach: '段階導入型',
      reasoning: '過去成功事例との類似度85%',
    };

    const stubAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(() => [0.87, 0.92, 0.78, 0.85]),
    };

    const firstExecutionResult = evaluatePatternRelevance(
      customerPatternData,
      proposalContentData,
      stubAIRecommendationEngine
    );

    const firstOverallScore = firstExecutionResult.overallScore;
    const firstItemScores = firstExecutionResult.itemScores;
    const firstPatternMasterId = firstExecutionResult.patternMasterId;

    const secondExecutionResult = evaluatePatternRelevance(
      customerPatternData,
      proposalContentData,
      stubAIRecommendationEngine
    );

    const secondOverallScore = secondExecutionResult.overallScore;
    const secondItemScores = secondExecutionResult.itemScores;
    const secondPatternMasterId = secondExecutionResult.patternMasterId;

    expect(firstOverallScore).toBe(secondOverallScore);
    expect(firstOverallScore).toBe(0.855);

    expect(firstItemScores).toEqual(secondItemScores);
    expect(firstItemScores).toEqual([0.87, 0.92, 0.78, 0.85]);

    expect(firstPatternMasterId).toBe(secondPatternMasterId);
    expect(typeof firstPatternMasterId).toBe('string');
  });
});