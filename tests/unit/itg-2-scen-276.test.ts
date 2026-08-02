import { calculateProcessComplianceDeviation } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-276
  test('提案ステップが標準プロセスと一致するとき、該当ステップの乖離度が0になる', () => {
    const proposal_record = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-001',
      process_step: '初期接触',
      step_sequence: 1,
      completion_date: new Date('2024-01-15T10:00:00Z'),
    };

    const standard_process_definition = {
      step_id: 'STEP-001',
      step_name: '初期接触',
      step_sequence: 1,
      required_activities: ['顧客情報収集', '初回面談'],
      expected_duration_days: 5,
    };

    const deviation_score = calculateProcessComplianceDeviation(
      proposal_record,
      standard_process_definition
    );

    expect(deviation_score).toBe(0.0);
  });
});