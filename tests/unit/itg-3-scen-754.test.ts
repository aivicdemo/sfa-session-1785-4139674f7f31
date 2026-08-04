import { judgeCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能 - 推奨パターンマスタが複数件の場合', () => {
  // SCEN-754
  test('推奨パターンマスタが複数件登録されているとき、顧客データが完全であれば推奨生成可能と判定される', () => {
    // Arrange: 推奨パターンマスタの複数件スタブを準備
    const successPatternStub = [
      {
        pattern_id: 'PATTERN_001',
        industry: '製造業',
        company_size: 'LARGE',
        decision_makers: 3,
        purchase_cycle_days: 90,
        success_rate: 0.85,
      },
      {
        pattern_id: 'PATTERN_002',
        industry: '情報通信業',
        company_size: 'MEDIUM',
        decision_makers: 2,
        purchase_cycle_days: 60,
        success_rate: 0.78,
      },
      {
        pattern_id: 'PATTERN_003',
        industry: '卸売業',
        company_size: 'SMALL',
        decision_makers: 1,
        purchase_cycle_days: 30,
        success_rate: 0.72,
      },
    ];

    // 顧客データ（必須項目全て入力済み）
    const customerData = {
      industry: '製造業',
      company_size: 'LARGE',
      decision_makers_count: 3,
      purchase_cycle_days: 90,
      annual_budget_jpy: 50000000,
      primary_need: '業務効率化',
      decision_timeline: '3ヶ月以内',
    };

    // Act: 顧客データ完全性・妥当性判定を実行
    const result = judgeCustomerDataCompleteness(
      customerData,
      successPatternStub,
    );

    // Assert: 推奨生成可能と判定されることを確認
    expect(result.eligible_for_recommendation).toBe(true);
    expect(result.recommendation_status).toBe('ELIGIBLE_FOR_RECOMMENDATION');
    expect(result.matching_pattern_count).toBe(3);
    expect(result.completeness_score).toBe(100);
  });
});