import { analyzeCustomerInteractionRecords } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-456
  test('顧客対応記録の項目が1つ欠けている場合、欠けている項目を検出して異常として可視化される', () => {
    const customer_interaction_records = [
      {
        record_id: 'CIR001',
        salesperson_id: 'SP001',
        customer_name: '株式会社ABC',
        interaction_date: '2024-01-15T10:00:00Z',
        interaction_content: '初回訪問・課題ヒアリング',
        next_followup_scheduled_date: null,
        created_at: '2024-01-15T10:30:00Z',
      },
    ];

    const report = analyzeCustomerInteractionRecords(customer_interaction_records);

    expect(report.quality_issues).toHaveLength(1);
    expect(report.quality_issues[0]).toEqual({
      record_id: 'CIR001',
      issue_type: '必須項目不足',
      missing_fields: ['next_followup_scheduled_date'],
      error_message: '次回フォローアップ予定日が未入力',
      severity: 'HIGH',
      flag_color: 'red',
    });

    expect(report.data_quality_problem_count).toBe(1);
    expect(report.anomaly_detected).toBe(true);
  });
});