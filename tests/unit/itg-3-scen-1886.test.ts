import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能 - AIRecommendationEngine null エラーハンドリング', () => {
  // SCEN-1886
  test('generateRecommendation が null を返すとき、代替の成功パターンと簡略版根拠を返却し、再試行は指数バックオフで最大3回実行される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const newDealInput = {
      customer_name: 'テスト顧客',
      industry: 'IT',
      budget_scale: 'large',
      current_stage: 'discovery',
      challenges: ['cost_reduction', 'efficiency'],
    };

    const startTime = Date.now();
    const result = await generateRecommendation(
      newDealInput,
      mockAIEngine,
      mockFileStorage,
    );
    const elapsedTime = Date.now() - startTime;

    // メッセージ確認
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );

    // 代替の成功パターンが存在することを確認
    expect(result.fallback_patterns).toBeDefined();
    expect(Array.isArray(result.fallback_patterns)).toBe(true);
    expect(result.fallback_patterns.length).toBeGreaterThan(0);

    // 最初の代替パターンが統計的に上位であることを確認
    expect(result.fallback_patterns[0].match_score).toBe(95);
    expect(result.fallback_patterns[0].success_rate).toBe(0.92);

    // 根拠説明が簡略版であることを確認
    expect(result.fallback_patterns[0].reasoning_summary).toBeDefined();
    expect(result.fallback_patterns[0].reasoning_summary.length).toBeLessThan(200);
    expect(result.fallback_patterns[0].reasoning_summary).toContain('過去事例');

    // API 再試行が3回実行されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 指数バックオフで呼び出されていることをコール順序から確認
    // 1回目: 即座、2回目: ~1秒後、3回目: ~2秒後の合計 ~3 秒以上かかることを期待
    expect(elapsedTime).toBeGreaterThanOrEqual(2800);
    expect(elapsedTime).toBeLessThan(30000);

    // 処理が 30 秒以内に完了していることを確認
    expect(elapsedTime).toBeLessThan(30000);

    // エラーが外部に露出していないことを確認
    expect(result.error).toBeUndefined();
    expect(result.status).toBe('success_with_fallback');
  });
});