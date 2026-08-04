import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ適用可能性判定機能', () => {
  // SCEN-2243
  test('適用可能性スコアが1.0（完全適用可能）と判定される', () => {
    const dealCondition = {
      industry: '製造業',
      budgetRange: '5000万円以上',
      implementationPeriod: '3ヶ月以内',
      decisionMaker: '経営層',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 1.0,
        status: '完全適用可能',
        approachName: '経営層向けDX戦略提案',
        reasoning: '当商談条件は過去の成功案件と完全に合致しています。大規模製造業の経営層決裁案件で、予算と期間が標準的な成功パターンと同一です。',
      }),
    };

    const result = evaluatePatternRelevance(dealCondition, mockAIEngine);

    expect(result.relevanceScore).toBe(1.0);
    expect(result.status).toBe('完全適用可能');
    expect(result.approachName).toBe('経営層向けDX戦略提案');
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.length).toBeGreaterThan(0);
  });
});