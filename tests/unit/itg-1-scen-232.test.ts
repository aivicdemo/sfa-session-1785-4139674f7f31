import { evaluateSystemHealth } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-232
  test('[edge] システムヘルスチェック判定機能 - 営業データの品質スコアが満点のとき合格判定が出力される', () => {
    const input = {
      salesDataQualityScore: 100,
      aiInferenceAccuracyScore: 95,
      systemOperationalStatus: 'healthy',
      evaluationDateTime: new Date('2024-01-15T11:00:00Z'),
    };

    const result = evaluateSystemHealth(input);

    expect(result.status).toBe('合格');
    expect(result.evaluationDateTime).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(result.salesDataQualityScore).toBe(100);
    expect(result.diagnosisReason).toBe('営業データ品質が基準を満たしています');
  });
});