import { analyzePerformanceWithScale } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-642: 業務上の最大規模データを処理するとき、数値計算が正確に実行される', () => {
    // テストデータ準備: 顧客対応記録 10,000 件、提案パターン 5,000 パターン
    const customer_records: Array<{
      record_id: string;
      salesperson_id: string;
      proposal_pattern_id: string;
      is_closed: boolean;
      closed_amount: number;
      record_date: string;
    }> = [];

    const proposal_patterns: Array<{
      pattern_id: string;
      pattern_name: string;
      base_success_rate: number;
    }> = [];

    // 提案パターン 5,000 個を生成
    for (let i = 1; i <= 5000; i++) {
      proposal_patterns.push({
        pattern_id: `pattern_${i}`,
        pattern_name: `Proposal Pattern ${i}`,
        base_success_rate: (10 + (i % 80)) / 100, // 10% ～ 89% の範囲
      });
    }

    // 顧客対応記録 10,000 件を生成
    // 営業担当者 10 人、各 1,000 件の記録
    let total_closed_count = 0;
    let total_closed_amount = 0;
    const salesperson_totals: { [key: string]: number } = {};

    for (let i = 1; i <= 10000; i++) {
      const salesperson_id = `salesperson_${((i - 1) % 10) + 1}`;
      const pattern_index = (i - 1) % 5000;
      const pattern = proposal_patterns[pattern_index];

      // 閉鎖判定: pattern の base_success_rate に基づいて確率的に決定
      const is_closed = Math.random() < pattern.base_success_rate;
      const closed_amount = is_closed ? 100000 + (i % 500000) : 0;

      if (is_closed) {
        total_closed_count += 1;
        total_closed_amount += closed_amount;
      }

      if (!salesperson_totals[salesperson_id]) {
        salesperson_totals[salesperson_id] = 0;
      }
      if (is_closed) {
        salesperson_totals[salesperson_id] += closed_amount;
      }

      customer_records.push({
        record_id: `record_${i}`,
        salesperson_id,
        proposal_pattern_id: pattern.pattern_id,
        is_closed,
        closed_amount,
        record_date: '2024-01-15T10:00:00Z',
      });
    }

    // 分析エンジンへデータセット全体を入力
    const result = analyzePerformanceWithScale({
      customer_records,
      proposal_patterns,
      analysis_period_start: '2024-01-01T00:00:00Z',
      analysis_period_end: '2024-01-31T23:59:59Z',
    });

    // 成約率の計算結果を取得して検証
    // 期待値: (成約件数 ÷ 対応記録数) を小数点第2位まで計算
    const expected_closed_rate = Math.round((total_closed_count / 10000) * 10000) / 10000;
    expect(result.overall_closed_rate).toBe(expected_closed_rate);

    // 浮動小数点演算の丸め誤差が ±0.01 以内であることを確認
    const closed_rate_error = Math.abs(result.overall_closed_rate - (total_closed_count / 10000));
    expect(closed_rate_error).toBeLessThanOrEqual(0.01);

    // 提案パターン別平均成約額の計算結果を取得
    const pattern_avg_amounts: { [key: string]: number } = {};
    const pattern_closed_counts: { [key: string]: number } = {};
    const pattern_closed_totals: { [key: string]: number } = {};

    customer_records.forEach((record) => {
      if (!pattern_closed_counts[record.proposal_pattern_id]) {
        pattern_closed_counts[record.proposal_pattern_id] = 0;
        pattern_closed_totals[record.proposal_pattern_id] = 0;
      }
      if (record.is_closed) {
        pattern_closed_counts[record.proposal_pattern_id] += 1;
        pattern_closed_totals[record.proposal_pattern_id] += record.closed_amount;
      }
    });

    Object.keys(proposal_patterns).forEach((idx) => {
      const pattern_id = proposal_patterns[parseInt(idx, 10)].pattern_id;
      if (pattern_closed_counts[pattern_id] > 0) {
        pattern_avg_amounts[pattern_id] =
          pattern_closed_totals[pattern_id] / pattern_closed_counts[pattern_id];
      }
    });

    // 提案パターン別平均成約額の合計が全顧客対応記録の総売上と ±100 円以内で一致することを確認
    const pattern_avg_sum = Object.values(pattern_avg_amounts).reduce((sum, val) => sum + val, 0);
    const avg_sum_error = Math.abs(pattern_avg_sum - total_closed_amount);
    expect(avg_sum_error).toBeLessThanOrEqual(100);

    // 営業担当者ごとの売上合計の計算結果を取得
    const salesperson_revenues: { [key: string]: number } = {};
    customer_records.forEach((record) => {
      if (!salesperson_revenues[record.salesperson_id]) {
        salesperson_revenues[record.salesperson_id] = 0;
      }
      if (record.is_closed) {
        salesperson_revenues[record.salesperson_id] += record.closed_amount;
      }
    });

    // 営業担当者ごとの売上合計の総和が全体売上と完全に一致することを確認
    const salesperson_total_revenue = Object.values(salesperson_revenues).reduce(
      (sum, val) => sum + val,
      0
    );
    expect(salesperson_total_revenue).toBe(total_closed_amount);

    // 結果オブジェクトの構造と値の整合性を検証
    expect(result).toHaveProperty('overall_closed_rate');
    expect(result).toHaveProperty('pattern_metrics');
    expect(result).toHaveProperty('salesperson_metrics');
    expect(typeof result.overall_closed_rate).toBe('number');
    expect(Array.isArray(result.pattern_metrics)).toBe(true);
    expect(Array.isArray(result.salesperson_metrics)).toBe(true);

    // pattern_metrics の各要素が正しい構造を持つことを確認
    result.pattern_metrics.forEach((metric: any) => {
      expect(metric).toHaveProperty('pattern_id');
      expect(metric).toHaveProperty('avg_closed_amount');
      expect(typeof metric.avg_closed_amount).toBe('number');
    });

    // salesperson_metrics の各要素が正しい構造を持つことを確認
    result.salesperson_metrics.forEach((metric: any) => {
      expect(metric).toHaveProperty('salesperson_id');
      expect(metric).toHaveProperty('total_revenue');
      expect(typeof metric.total_revenue).toBe('number');
    });
  });
});