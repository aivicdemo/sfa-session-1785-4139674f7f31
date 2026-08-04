import { evaluatePriorityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-456: 改善優先度スコアリング機能 - エラー件数が閾値直下の場合、優先度スコアが正しく算出される', () => {
    // テストデータ：エラー件数が閾値直下（99件、閾値100件）
    const errorCountThreshold = 100;
    const errorCount = 99;
    const dealAmount = 5000000; // 商談金額：500万円（標準値）
    const industryType = 'manufacturing'; // 業種：製造業（標準値）
    const proposalComplexity = 3; // 提案複雑度：3（標準値、1-5スケール）

    // AIRecommendationEngine スタブ
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.85,
        confidence: 0.92,
      }),
    };

    // 改善優先度スコアリング機能を実行
    const priorityScore = evaluatePriorityScore(
      {
        errorCount,
        errorCountThreshold,
        dealAmount,
        industryType,
        proposalComplexity,
      },
      mockAIEngine
    );

    // 期待値計算：
    // スコア = (1 - errorCount/errorCountThreshold) * 50 + dealAmountFactor * 30 + industryFactor * 15 + complexityFactor * 5
    // エラー件数99件の場合：(1 - 99/100) * 50 = 0.5
    // 商談金額500万円の標準化スコア：0.7（範囲内の中程度値）
    // 業種製造業のスコア：0.8（標準業種）
    // 提案複雑度3のスコア：0.6（中程度）
    // 最終スコア = 0.5 * 50 + 0.7 * 30 + 0.8 * 15 + 0.6 * 5 = 25 + 21 + 12 + 3 = 61
    const expectedPriorityScore = 61;

    // アサーション：優先度スコアが正確に算出されること
    expect(priorityScore).toBe(expectedPriorityScore);

    // アサーション：スコアが数値型であること
    expect(typeof priorityScore).toBe('number');

    // アサーション：スコアが定義された範囲（0～100）内にあること
    expect(priorityScore).toBeGreaterThanOrEqual(0);
    expect(priorityScore).toBeLessThanOrEqual(100);

    // アサーション：同じ入力で複数実行した場合、同一のスコア値が得られること
    const priorityScore2 = evaluatePriorityScore(
      {
        errorCount,
        errorCountThreshold,
        dealAmount,
        industryType,
        proposalComplexity,
      },
      mockAIEngine
    );
    expect(priorityScore2).toBe(expectedPriorityScore);

    // アサーション：エラー件数が閾値に近づくにつれてスコアが単調増加すること
    const priorityScoreWith95Errors = evaluatePriorityScore(
      {
        errorCount: 95,
        errorCountThreshold,
        dealAmount,
        industryType,
        proposalComplexity,
      },
      mockAIEngine
    );
    // エラー件数95件の場合：(1 - 95/100) * 50 = 2.5
    // 最終スコア = 2.5 * 50 + 0.7 * 30 + 0.8 * 15 + 0.6 * 5 = 25 + 21 + 12 + 3 = 61（端数調整後同値）
    // または増加傾向の検証：95件の方が99件より低いエラー比率なので低スコア
    expect(priorityScoreWith95Errors).toBeLessThan(priorityScore);
  });
});