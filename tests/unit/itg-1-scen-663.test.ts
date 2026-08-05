import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度監視 - 異常パターン検出と可視化', () => {
  test('SCEN-663: 異常パターンが検出されない場合、営業担当者ごとの行動パターン分析レポートに異常フラグが立たない', async () => {
    // Arrange: テストデータの準備
    const sales_rep_id = 'sales_rep_001';
    const analysis_start_date = new Date('2024-11-01T00:00:00Z');
    const analysis_end_date = new Date('2024-12-01T00:00:00Z');
    
    // 過去12ヶ月の平均値を定義
    const baseline_visits_avg = 50;
    const baseline_proposals_avg = 30;
    const baseline_contracts_avg = 10;
    const baseline_avg_deal_duration_days = 45;
    
    // 正常範囲内（±10%）のテストデータ
    const activity_metrics = {
      visits_count: 51,           // 50 + 2%
      proposals_count: 29,        // 30 - 3.3%
      contracts_count: 10,        // 10 + 0%
      average_deal_duration_days: 45 // 45 + 0%
    };
    
    // 異常度スコア計算用のベースライン
    const visit_deviation = Math.abs(activity_metrics.visits_count - baseline_visits_avg) / baseline_visits_avg;
    const proposal_deviation = Math.abs(activity_metrics.proposals_count - baseline_proposals_avg) / baseline_proposals_avg;
    const contract_deviation = Math.abs(activity_metrics.contracts_count - baseline_contracts_avg) / baseline_contracts_avg;
    const duration_deviation = Math.abs(activity_metrics.average_deal_duration_days - baseline_avg_deal_duration_days) / baseline_avg_deal_duration_days;
    
    // 異常度スコア：すべての偏差が10%以内なので、平均は低い値になる
    const expected_anomaly_score = (visit_deviation + proposal_deviation + contract_deviation + duration_deviation) / 4;
    
    // import logic module
    const { generateBehaviorPatternAnalysisReport } = await import('../../src/logic/it-1-br-2-1-1-1');
    
    // Act: 行動パターン分析レポート生成API実行
    const report = await generateBehaviorPatternAnalysisReport({
      sales_rep_id,
      analysis_period_start: analysis_start_date,
      analysis_period_end: analysis_end_date,
      activity_metrics
    });
    
    // Assert: 期待結果の検証
    // 1. 異常フラグ（abnormalityFlag）がfalseであることを確認
    expect(report.abnormality_flag).toBe(false);
    
    // 2. 検出された異常パターン配列が空配列であることを確認
    expect(report.detected_anomalies).toEqual([]);
    
    // 3. 異常度スコア（anomalyScore）が0.0に近い値（許容誤差0.15以内）であることを確認
    expect(report.anomaly_score).toBeLessThanOrEqual(0.15);
  });
});