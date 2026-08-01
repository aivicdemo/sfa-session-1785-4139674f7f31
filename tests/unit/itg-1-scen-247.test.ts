import { checkSystemHealth } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-247
  test('システムヘルスチェック判定機能 - 複数の営業データ品質スコアの中に1件でも不合格があるとき不合格判定が出力される', () => {
    const salesDataQualityScores = [
      { dataId: 'data_001', qualityScore: 85 },
      { dataId: 'data_002', qualityScore: 55 },
      { dataId: 'data_003', qualityScore: 92 },
    ];

    const result = checkSystemHealth(salesDataQualityScores);

    expect(result.overallStatus).toBe('fail');
    expect(result.reason).toContain('営業データ品質スコア：不合格データ件数 1件');
  });
});