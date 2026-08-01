import { analyzeAcquisitionPersonBehaviorPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-810
  test('特定のステップが営業活動ログに0件で欠落している場合、そのステップの乖離度は100%と計算される', () => {
    const sales_person_id = 'SP-001';
    const process_step_definition = [
      { step_id: 'STEP-01', step_name: '初回接触', expected_count: 1 },
      { step_id: 'STEP-02', step_name: '提案', expected_count: 1 },
      { step_id: 'STEP-03', step_name: 'フォローアップ', expected_count: 1 },
      { step_id: 'STEP-04', step_name: '契約締結', expected_count: 1 },
    ];
    const activity_log = [
      {
        sales_person_id: 'SP-001',
        step_id: 'STEP-01',
        activity_date: '2024-01-10',
        activity_count: 5,
      },
      {
        sales_person_id: 'SP-001',
        step_id: 'STEP-02',
        activity_date: '2024-01-15',
        activity_count: 3,
      },
      {
        sales_person_id: 'SP-001',
        step_id: 'STEP-04',
        activity_date: '2024-01-25',
        activity_count: 2,
      },
    ];
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';

    const result = analyzeAcquisitionPersonBehaviorPattern({
      sales_person_id,
      process_step_definition,
      activity_log,
      analysis_period_start,
      analysis_period_end,
    });

    expect(result).toEqual({
      sales_person_id: 'SP-001',
      analysis_period: {
        start_date: '2024-01-01',
        end_date: '2024-01-31',
      },
      step_analysis: [
        {
          step_id: 'STEP-01',
          step_name: '初回接触',
          expected_count: 1,
          actual_count: 5,
          deviation_percentage: 0,
        },
        {
          step_id: 'STEP-02',
          step_name: '提案',
          expected_count: 1,
          actual_count: 3,
          deviation_percentage: 0,
        },
        {
          step_id: 'STEP-03',
          step_name: 'フォローアップ',
          expected_count: 1,
          actual_count: 0,
          deviation_percentage: 100,
        },
        {
          step_id: 'STEP-04',
          step_name: '契約締結',
          expected_count: 1,
          actual_count: 2,
          deviation_percentage: 0,
        },
      ],
      overall_compliance_score: 75,
    });
  });
});