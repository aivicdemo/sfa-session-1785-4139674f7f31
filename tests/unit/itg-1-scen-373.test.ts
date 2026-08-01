import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-373
  test('同じ行動パターンが重複して含まれるとき、重複が排除される', () => {
    const input_sales_person_id = 'SP001';
    const input_behavior_pattern_1 = '初回接触→提案資料送付→フォローアップ電話';
    const input_behavior_pattern_2 = '初回接触→提案資料送付→フォローアップ電話';
    const input_behavior_pattern_3 = 'メール送付→提案説明→顧客確認待ち';

    const input_activity_logs = [
      {
        sales_person_id: input_sales_person_id,
        behavior_pattern: input_behavior_pattern_1,
        occurrence_count: 1,
        success_rate: 0.75,
      },
      {
        sales_person_id: input_sales_person_id,
        behavior_pattern: input_behavior_pattern_2,
        occurrence_count: 1,
        success_rate: 0.75,
      },
      {
        sales_person_id: input_sales_person_id,
        behavior_pattern: input_behavior_pattern_3,
        occurrence_count: 1,
        success_rate: 0.60,
      },
    ];

    const report = generateBehaviorPatternAnalysisReport(
      input_sales_person_id,
      input_activity_logs
    );

    const expected_unique_pattern_count = 2;
    expect(report.behavior_patterns.length).toBe(expected_unique_pattern_count);

    const pattern_texts = report.behavior_patterns.map((p) => p.pattern);
    expect(pattern_texts).toContain(input_behavior_pattern_1);
    expect(pattern_texts).toContain(input_behavior_pattern_3);

    const pattern_1_in_report = report.behavior_patterns.filter(
      (p) => p.pattern === input_behavior_pattern_1
    );
    expect(pattern_1_in_report.length).toBe(1);

    const pattern_3_in_report = report.behavior_patterns.filter(
      (p) => p.pattern === input_behavior_pattern_3
    );
    expect(pattern_3_in_report.length).toBe(1);

    const aggregated_occurrence_count_for_pattern_1 = 2;
    expect(pattern_1_in_report[0].aggregated_occurrence_count).toBe(
      aggregated_occurrence_count_for_pattern_1
    );
  });
});