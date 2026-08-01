import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-629: [edge] 乖離度が±5%直上（例：+5.1%）の場合、改善優先度が「中」に判定される', () => {
    // Arrange: テストデータの準備
    const sales_person_id = 'SP_001';
    const sales_person_name = '営業太郎';
    const deviation_rate = 5.1; // 乖離度が+5.1%（±5%の直上）
    const standard_compliance_score = 94.9; // 100 - 5.1 = 94.9
    const contract_achievement_rate = 72.5; // 契約達成率
    const proposal_accuracy_rate = 68.3; // 提案精度
    const followup_success_rate = 65.2; // フォローアップ成功率

    const input_data = {
      sales_person_id: sales_person_id,
      sales_person_name: sales_person_name,
      analysis_period: '2024-01',
      deviation_rate: deviation_rate,
      standard_compliance_score: standard_compliance_score,
      contract_achievement_rate: contract_achievement_rate,
      proposal_accuracy_rate: proposal_accuracy_rate,
      followup_success_rate: followup_success_rate,
      total_activity_count: 45,
      first_contact_count: 12,
      proposal_count: 18,
      negotiation_count: 8,
      contract_count: 5,
    };

    // Act: 行動パターン分析レポート生成機能を実行
    const report = generateBehaviorPatternAnalysisReport(input_data);

    // Assert: 生成されたレポートの改善優先度が「中」であることを確認
    expect(report.improvement_priority).toBe('中');
    expect(report.sales_person_id).toBe(sales_person_id);
    expect(report.sales_person_name).toBe(sales_person_name);
    expect(report.deviation_rate).toBe(5.1);
    expect(report.analysis_period).toBe('2024-01');
  });
});