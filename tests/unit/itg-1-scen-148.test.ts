import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-148
  test('乖離度が50%のとき、標準プロセス遵守度スコアが50として計算される', () => {
    const sales_rep_id = 'TEST-001';
    const standard_process_steps = [
      { step_number: 1, step_name: 'initial_contact', expected_order: 1 },
      { step_number: 2, step_name: 'needs_analysis', expected_order: 2 },
      { step_number: 3, step_name: 'proposal', expected_order: 3 },
      { step_number: 4, step_name: 'negotiation', expected_order: 4 },
      { step_number: 5, step_name: 'contract', expected_order: 5 }
    ];
    const actual_behavior_log = [
      { sales_rep_id: sales_rep_id, activity_step: 'initial_contact', activity_order: 1, timestamp: '2024-01-01T09:00:00Z' },
      { sales_rep_id: sales_rep_id, activity_step: 'proposal', activity_order: 2, timestamp: '2024-01-02T10:00:00Z' },
      { sales_rep_id: sales_rep_id, activity_step: 'needs_analysis', activity_order: 3, timestamp: '2024-01-03T11:00:00Z' },
      { sales_rep_id: sales_rep_id, activity_step: 'negotiation', activity_order: 4, timestamp: '2024-01-04T14:00:00Z' },
      { sales_rep_id: sales_rep_id, activity_step: 'contract', activity_order: 5, timestamp: '2024-01-05T15:00:00Z' }
    ];

    const report = generateBehaviorPatternAnalysisReport(
      sales_rep_id,
      standard_process_steps,
      actual_behavior_log
    );

    expect(report.process_compliance_score).toBe(50);
  });
});