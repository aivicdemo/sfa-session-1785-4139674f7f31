import { analyzeAndMatchSuccessPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-410
  test('成功パターン適用判定機能 - 営業活動実績期間の開始日と終了日が同一である場合、パターンマッチング対象として正しく処理される', () => {
    const sales_activity_data = {
      sales_representative_id: 'SR001',
      customer_id: 'CUST001',
      activity_start_date: new Date('2024-01-15T00:00:00Z'),
      activity_end_date: new Date('2024-01-15T00:00:00Z'),
      proposal_content: 'テスト提案',
      contact_frequency: 5,
      follow_up_interval_days: 3,
    };

    const success_patterns = [
      {
        pattern_id: 'PAT001',
        contact_frequency_range_min: 4,
        contact_frequency_range_max: 10,
        follow_up_interval_range_min: 1,
        follow_up_interval_range_max: 5,
        success_rate: 0.75,
      },
    ];

    const result = analyzeAndMatchSuccessPattern(
      sales_activity_data,
      success_patterns
    );

    expect(result.is_pattern_matching_target).toBe(true);
    expect(result.judgment_status).toBe('対象');
    expect(result.matched_pattern_ids).toContain('PAT001');
  });
});