import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-545
  test('成約実績データが空配列の場合、バリデーションエラーがスローされること', () => {
    const sales_representative_id = 'SR-001';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';
    const contract_results = [];
    const activity_patterns = [
      {
        activity_id: 'ACT-001',
        sales_rep_id: 'SR-001',
        contact_frequency: 5,
        proposal_content: 'proposal_A',
        followup_interval_days: 3,
      },
    ];
    const process_standard = {
      step_name: 'Initial Contact',
      expected_frequency: 2,
      expected_duration_days: 7,
    };

    expect(() =>
      generateSalesActivityPatternAnalysisReport({
        sales_representative_id,
        analysis_start_date,
        analysis_end_date,
        contract_results,
        activity_patterns,
        process_standard,
      }),
    ).toThrow(/成約実績データが/);
  });
});