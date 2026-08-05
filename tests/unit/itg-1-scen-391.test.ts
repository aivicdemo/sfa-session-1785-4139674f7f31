import { describe, test, expect, beforeEach } from '@jest/globals';

describe('成功パターンマトリクス適用判定機能', () => {
  test('SCEN-391: 過去成約日時が将来日のパターンは参照対象外として除外される', () => {
    // Setup: テスト対象の成功パターンマトリクス適用判定機能を初期化
    const { determineApplicableSuccessPatterns } = require('../../src/logic/it-1-br-2-1-1-1');

    // 現在日時を固定
    const current_date = new Date('2024-06-15T10:00:00Z');

    // 成功パターンレコード1件: 過去成約日時を現在日時より後の将来日時に設定
    const success_pattern_future = {
      pattern_id: 'pat_future_001',
      customer_attribute: 'enterprise',
      product_category: 'software',
      successful_contract_date: new Date('2099-12-31T23:59:59Z'), // 将来日時
      proposal_content: 'cloud_migration',
      success_count: 5,
      total_count: 8,
      success_rate: 0.625
    };

    // 成功パターンレコード2件: 過去成約日時が現在より前（正常なデータ）
    const success_pattern_past = {
      pattern_id: 'pat_past_001',
      customer_attribute: 'enterprise',
      product_category: 'software',
      successful_contract_date: new Date('2024-03-15T14:30:00Z'), // 過去日時
      proposal_content: 'optimization',
      success_count: 12,
      total_count: 15,
      success_rate: 0.8
    };

    // マトリクスデータ: 複数の成功パターンを含む
    const success_pattern_matrix = [
      success_pattern_future,
      success_pattern_past
    ];

    // 現在の顧客条件に基づいて適用判定を実行
    const current_condition = {
      customer_attribute: 'enterprise',
      product_category: 'software'
    };

    // 適用判定ロジックを実行
    const applicable_patterns = determineApplicableSuccessPatterns(
      success_pattern_matrix,
      current_condition,
      current_date
    );

    // 期待結果: 過去成約日時が将来日のレコードは参照対象から除外される
    // 返却されたマトリクス参照対象リストに当該成功パターンが含まれていないこと
    const pattern_ids_in_result = applicable_patterns.map((p: { pattern_id: string }) => p.pattern_id);

    expect(pattern_ids_in_result).toContain('pat_past_001');
    expect(pattern_ids_in_result).not.toContain('pat_future_001');
    expect(applicable_patterns.length).toBe(1);
    expect(applicable_patterns[0].pattern_id).toBe('pat_past_001');
    expect(applicable_patterns[0].success_rate).toBe(0.8);
  });
});