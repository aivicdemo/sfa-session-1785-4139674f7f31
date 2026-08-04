import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 空パターン処理', () => {
  // SCEN-2655
  test('成功パターンテンプレートが0件のとき、推奨ロジックに組み込める形で空結果が出力される', () => {
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      industry: 'IT',
      budget: 5000000,
      decisionTimeline: 2,
      companySize: 'large',
    };

    const result = evaluatePatternRelevance(
      newDealCondition,
      aiRecommendationEngineStub
    );

    expect(result).toEqual({
      patterns: [],
      isEmpty: true,
      fallbackMessage: '推奨対象となる過去成功パターンがありません',
      alternativeAction: 'マスタデータの統計上位パターンを表示可能',
    });

    expect(result.patterns).toHaveLength(0);
    expect(result.isEmpty).toBe(true);
    expect(typeof result.fallbackMessage).toBe('string');
    expect(result.fallbackMessage).toMatch(/推奨対象となる過去成功パターンがありません/);
    expect(typeof result.alternativeAction).toBe('string');
    expect(result.alternativeAction).toMatch(/代替動作/);
  });
});