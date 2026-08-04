import { determinePrioritizationRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク決定機能', () => {
  // SCEN-421
  test('エラー件数が1件の場合、ランクが正しく決定される', async () => {
    // スタブ設定: AIRecommendationEngineの代替実装
    const mockAIEngine = {
      getDataQualityErrorCount: jest.fn().mockResolvedValue({
        errorCount: 1,
        timestamp: new Date('2024-01-15T11:00:00Z').toISOString()
      })
    };

    // テスト入力: エラー件数1件のデータセット
    const testInput = {
      dealId: 'DEAL-001',
      customerId: 'CUST-A001',
      errorData: {
        errorCount: 1,
        detectedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
        errorCategory: 'dataQuality'
      },
      aiEngine: mockAIEngine
    };

    // 改善優先度ランク決定関数を実行
    const result = await determinePrioritizationRank(testInput);

    // 期待結果の検証
    // エラー件数1件の場合、優先度スコアは25～40の範囲でLowランク
    expect(result).toEqual({
      rankLevel: 'Low',
      priorityScore: 30,
      dealId: 'DEAL-001',
      customerId: 'CUST-A001',
      errorCount: 1,
      determinedAt: expect.any(String),
      recommendation: expect.any(String)
    });

    expect(result.priorityScore).toBeGreaterThanOrEqual(25);
    expect(result.priorityScore).toBeLessThanOrEqual(40);
    expect(result.rankLevel).toBe('Low');
    expect(mockAIEngine.getDataQualityErrorCount).toHaveBeenCalledWith('DEAL-001');
  });
});