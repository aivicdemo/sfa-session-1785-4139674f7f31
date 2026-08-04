import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠可視化機能', () => {
  // SCEN-839
  test('AIRecommendationEngine.evaluatePatternRelevance が失敗したとき、代替パターンマスタから統計的に上位の成功パターンを返す', async () => {
    // ===== 前提条件セットアップ =====
    // 推奨パターンマスタの登録データ
    const recommendationPatternMaster = [
      {
        patternId: 'PATTERN_A',
        successCount: 45,
        successRate: 78,
        description: '過去の同条件案件での成功実績が最も高いパターンです',
      },
      {
        patternId: 'PATTERN_B',
        successCount: 32,
        successRate: 71,
        description: '中程度の成功実績を持つパターンです',
      },
      {
        patternId: 'PATTERN_C',
        successCount: 18,
        successRate: 65,
        description: '基本的な成功パターンです',
      },
    ];

    // AIRecommendationEngine.evaluatePatternRelevance のスタブ
    // エラー（API呼び出し失敗）を発生させるよう設定
    const mockEvaluatePatternRelevance = jest
      .fn()
      .mockRejectedValueOnce(new Error('External API failure'))
      .mockRejectedValueOnce(new Error('External API timeout'))
      .mockRejectedValueOnce(new Error('External API connection refused'));

    // 新規案件の顧客・商談条件
    const dealCondition = {
      industry: '製造業',
      budgetScale: '中規模',
      decisionMakerCount: 3,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      generateRecommendation: jest.fn(),
    };

    // ===== テスト実行 =====
    const result = await generateRecommendation(
      dealCondition,
      recommendationPatternMaster,
      mockAIRecommendationEngine
    );

    // ===== 期待結果の検証 =====
    // 1. evaluatePatternRelevance が最大3回再試行されたことを確認
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // 2. 統計的に最上位のパターン（パターンA）が返却されたことを確認
    expect(result.patternId).toBe('PATTERN_A');
    expect(result.successCount).toBe(45);
    expect(result.successRate).toBe(78);

    // 3. 根拠説明が簡略版テンプレートであることを確認
    expect(result.reasoningExplanation).toBe(
      '過去の同条件案件での成功実績が最も高いパターンです'
    );

    // 4. 信頼度スコアがマスタの成功率から導出されていることを確認
    expect(result.confidenceScore).toBe(78);

    // 5. 代替動作フラグが設定されていることを確認
    expect(result.isFallbackPattern).toBe(true);
  });
});