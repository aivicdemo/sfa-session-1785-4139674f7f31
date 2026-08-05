import { determineApplicableSuccessPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-416: [edge] 成功パターン適用判定機能 - 過去最大規模の商談金額を含むパターンが現在の顧客に適用可能か判定される
  test('過去最大規模の商談金額パターンが現在の顧客に対して適用可能と判定される', () => {
    // Arrange: 過去最大規模の商談金額を示す成功パターンを準備
    const max_scale_success_pattern = {
      pattern_id: 'pat_max_001',
      deal_amount_jpy: 10000000, // 1000万円
      industry: '製造業',
      deal_duration_months: 12,
      success_count: 5,
      total_attempts: 6,
      success_rate: 0.8333,
    };

    // 現在の顧客データを準備
    const current_customer = {
      customer_id: 'cust_002',
      deal_amount_jpy: 8000000, // 800万円
      industry: '製造業',
      deal_duration_months: 10,
    };

    // 成功パターンマスタを準備（複数パターン含む）
    const success_patterns_master = [
      {
        pattern_id: 'pat_001',
        deal_amount_jpy: 3000000,
        industry: '製造業',
        deal_duration_months: 6,
        success_count: 10,
        total_attempts: 12,
        success_rate: 0.8333,
      },
      max_scale_success_pattern,
      {
        pattern_id: 'pat_003',
        deal_amount_jpy: 5000000,
        industry: '小売業',
        deal_duration_months: 8,
        success_count: 7,
        total_attempts: 10,
        success_rate: 0.7,
      },
    ];

    // Act: 顧客の適用可能な成功パターン判定機能を実行
    const applicable_patterns = determineApplicableSuccessPatterns(
      current_customer,
      success_patterns_master
    );

    // Assert: 判定結果から過去最大規模パターンの適用可否を確認
    // 期待結果: 1000万円、製造業のパターンが適用可能と判定される
    expect(applicable_patterns).toBeDefined();
    expect(Array.isArray(applicable_patterns)).toBe(true);

    // 過去最大規模パターンが適用可能パターン一覧に含まれることを確認
    const max_pattern_found = applicable_patterns.some(
      (pattern) => pattern.pattern_id === 'pat_max_001'
    );
    expect(max_pattern_found).toBe(true);

    // 適用可能パターンの詳細を検証
    const applicable_max_pattern = applicable_patterns.find(
      (pattern) => pattern.pattern_id === 'pat_max_001'
    );
    expect(applicable_max_pattern).toBeDefined();
    expect(applicable_max_pattern?.deal_amount_jpy).toBe(10000000);
    expect(applicable_max_pattern?.industry).toBe('製造業');
    expect(applicable_max_pattern?.deal_duration_months).toBe(12);

    // 同業種（製造業）のパターンのみが適用可能パターンに含まれることを確認
    const all_applicable_industries = applicable_patterns.map(
      (pattern) => pattern.industry
    );
    expect(all_applicable_industries.every((ind) => ind === '製造業')).toBe(true);

    // 現在の顧客金額（800万円）以下のパターンが適用可能であることを確認
    const all_applicable_amounts = applicable_patterns.map(
      (pattern) => pattern.deal_amount_jpy
    );
    expect(
      all_applicable_amounts.every(
        (amount) => amount <= current_customer.deal_amount_jpy
      )
    ).toBe(true);

    // 過去最大規模パターンを含め、複数の適用可能パターンが返されることを確認
    expect(applicable_patterns.length).toBeGreaterThan(0);
  });
});