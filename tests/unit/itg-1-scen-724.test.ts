import { calculateAnomalyScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-724: [edge] 提案内容と顧客対応パターンの標準プロセス比較分析 - 異常度スコアの計算で端数が発生する場合の丸め処理を検証
  test('異常度スコア計算で端数が発生する場合、小数点第2位で正しく丸められ、number型で返却されること', () => {
    // Arrange: 異常度スコア計算用パラメータを設定
    const proposal_response_time_seconds = 45.678;
    const standard_response_time_seconds = 45;
    const customer_satisfaction_percent = 87.456;

    // Act: 異常度スコア計算関数を実行
    const anomaly_score = calculateAnomalyScore({
      proposal_response_time_seconds,
      standard_response_time_seconds,
      customer_satisfaction_percent,
    });

    // Assert: 結果が数値型であり、NaN と無限大でないことを確認
    expect(typeof anomaly_score).toBe('number');
    expect(Number.isNaN(anomaly_score)).toBe(false);
    expect(Number.isFinite(anomaly_score)).toBe(true);

    // Assert: 小数点第2位の精度で検証（四捨五入ルールで45.68または45.69）
    const rounded_to_two_decimals = Math.round(anomaly_score * 100) / 100;
    expect(rounded_to_two_decimals).toBeGreaterThanOrEqual(45.68);
    expect(rounded_to_two_decimals).toBeLessThanOrEqual(45.69);

    // Assert: 結果が実際に小数点第2位で格納されていることを確認
    const decimal_places = (anomaly_score.toString().split('.')[1] || '').length;
    expect(decimal_places).toBeLessThanOrEqual(2);
  });
});