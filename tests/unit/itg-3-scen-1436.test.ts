import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1436
  test('成功パターンの抽出順序が逆のとき、推奨結果の順位付けが正しく行われる', () => {
    // テストデータ: 過去成功パターン3件
    const patternA = {
      id: 'pattern_a',
      score: 0.95,
      customerSize: '大企業',
      industry: 'IT',
      rank: 0,
    };

    const patternB = {
      id: 'pattern_b',
      score: 0.87,
      customerSize: '中堅企業',
      industry: '製造',
      rank: 0,
    };

    const patternC = {
      id: 'pattern_c',
      score: 0.72,
      customerSize: '小規模',
      industry: 'サービス',
      rank: 0,
    };

    // AIRecommendationEngineをモック化
    // 成功パターンを逆順（C→B→A）で返却
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([patternC, patternB, patternA]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データ
    const newDealData = {
      customerSize: '大企業',
      industry: 'IT',
      budgetRange: '1000万円以上',
    };

    // generateRecommendationメソッドを呼び出し
    const result = generateRecommendation(newDealData, mockAIEngine);

    // 返却された推奨結果内の成功パターンリストがスコアの降順に正しく順位付けされていることを確認
    expect(result.recommendedPatterns).toHaveLength(3);

    // 最高優先度の推奨パターン（1位）がパターンA（スコア0.95）であることを検証
    expect(result.recommendedPatterns[0].id).toBe('pattern_a');
    expect(result.recommendedPatterns[0].score).toBe(0.95);
    expect(result.recommendedPatterns[0].rank).toBe(1);

    // 2位がパターンB
    expect(result.recommendedPatterns[1].id).toBe('pattern_b');
    expect(result.recommendedPatterns[1].score).toBe(0.87);
    expect(result.recommendedPatterns[1].rank).toBe(2);

    // 3位がパターンC
    expect(result.recommendedPatterns[2].id).toBe('pattern_c');
    expect(result.recommendedPatterns[2].score).toBe(0.72);
    expect(result.recommendedPatterns[2].rank).toBe(3);

    // 各パターンの属性情報が期待値と一致することを検証
    expect(result.recommendedPatterns[0].customerSize).toBe('大企業');
    expect(result.recommendedPatterns[0].industry).toBe('IT');

    expect(result.recommendedPatterns[1].customerSize).toBe('中堅企業');
    expect(result.recommendedPatterns[1].industry).toBe('製造');

    expect(result.recommendedPatterns[2].customerSize).toBe('小規模');
    expect(result.recommendedPatterns[2].industry).toBe('サービス');
  });
});