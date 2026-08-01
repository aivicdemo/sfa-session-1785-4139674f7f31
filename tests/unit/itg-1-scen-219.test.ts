import { calculateSalesDataQualityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-219
  test('営業データ品質が合格基準直上のとき合格判定が出力される', () => {
    const passing_score_threshold = 80;
    const input_quality_score = 80;

    const result = calculateSalesDataQualityScore({
      qualityScore: input_quality_score,
      passingThreshold: passing_score_threshold,
    });

    expect(result.status).toBe('合格');
    expect(result.score).toBe(80);
    expect(result.reason).toMatch(/営業データ品質スコア：80点/);
    expect(result.reason).toMatch(/合格基準以上/);
  });
});