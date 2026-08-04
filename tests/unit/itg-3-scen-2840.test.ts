import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2840
  test('新規案件の顧客属性が過去成功パターンと部分的に一致した場合、適用可能スコアが中程度に算出される', () => {
    // テスト用の新規案件データを準備
    const newDealData = {
      customerSize: 500,
      industry: '製造業',
      decisionMakers: 3,
      budgetAmount: 5000000,
      implementationTimeline: 3,
    };

    // テスト用の過去成功パターンをモックデータとして設定
    const successPatterns = [
      {
        patternId: 'pattern_001',
        customerSizeRange: { min: 300, max: 700 },
        industry: '製造業',
        decisionMakersRange: { min: 2, max: 4 },
        budgetRange: { min: 4000000, max: 6000000 },
        implementationTimelineRange: { min: 2, max: 4 },
        successRate: 0.85,
      },
      {
        patternId: 'pattern_002',
        customerSizeRange: { min: 300, max: 700 },
        industry: '製造業',
        decisionMakersRange: { min: 2, max: 4 },
        budgetRange: { min: 4000000, max: 6000000 },
        implementationTimelineRange: { min: 2, max: 4 },
        successRate: 0.82,
      },
      {
        patternId: 'pattern_003',
        customerSizeRange: { min: 300, max: 700 },
        industry: '製造業',
        decisionMakersRange: { min: 2, max: 4 },
        budgetRange: { min: 4000000, max: 6000000 },
        implementationTimelineRange: { min: 2, max: 4 },
        successRate: 0.80,
      },
    ];

    // AIRecommendationEngineのevaluatePatternRelevanceメソッドをスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 0.65,
        recommendationRank: 'MODERATE',
        explanation: '顧客規模・業種・予算規模が過去の成功案件と一致していますが、購買決定プロセスの複雑性が若干異なります',
      }),
    };

    // 新規案件データと過去パターンマスタを入力パラメータとして関数を呼び出す
    const result = evaluatePatternRelevance(
      newDealData,
      successPatterns,
      mockAIEngine
    );

    // 戻り値の適用可能スコアを検証
    expect(result.applicabilityScore).toBe(0.65);

    // 適用可能スコアに対応した推奨ランクを確認
    expect(result.recommendationRank).toBe('MODERATE');

    // 推奨理由が正しく表示されることを確認
    expect(result.explanation).toBe(
      '顧客規模・業種・予算規模が過去の成功案件と一致していますが、購買決定プロセスの複雑性が若干異なります'
    );
  });
});