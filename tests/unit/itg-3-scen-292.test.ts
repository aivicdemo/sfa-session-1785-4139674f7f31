import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  test('SCEN-292: 抽出された成功パターンが1件のとき、適用可能性スコアが算出される', () => {
    // 入力データ：新規案件の条件
    const newDealCondition = {
      customerId: 'CUST-001',
      customerIndustry: 'IT',
      dealSize: 5000000,
      dealStage: '提案段階'
    };

    // 抽出された成功パターン（1件）
    const singleSuccessPattern = {
      patternId: 'PATTERN-MATCH-001',
      customerIndustry: 'IT',
      dealSizeMin: 3000000,
      dealSizeMax: 8000000,
      recommendedApproach: 'テクノロジー導入支援',
      approachMethod: 'ROI訴求型提案'
    };

    // AIRecommendationEngine.evaluatePatternRelevance が返すスコア（0.0～1.0の範囲）
    const expectedRelevanceScore = 0.75;

    // マッチした条件項目（スコア算出根拠）
    const expectedMatchedConditions = [
      'customerIndustry一致',
      'dealSize範囲内'
    ];

    // 適用可能性評価機能を実行
    const result = evaluatePatternRelevance(newDealCondition, singleSuccessPattern);

    // 期待結果を検証
    expect(result).toEqual({
      patternId: 'PATTERN-MATCH-001',
      applicabilityScore: expectedRelevanceScore,
      matchedConditions: expectedMatchedConditions
    });

    // スコアが0.0～1.0の範囲値であることを確認
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.applicabilityScore).toBeLessThanOrEqual(1.0);

    // スコアが具体的な数値であることを確認
    expect(result.applicabilityScore).toBe(0.75);

    // マッチした条件のリストが存在することを確認
    expect(Array.isArray(result.matchedConditions)).toBe(true);
    expect(result.matchedConditions.length).toBeGreaterThan(0);
  });
});