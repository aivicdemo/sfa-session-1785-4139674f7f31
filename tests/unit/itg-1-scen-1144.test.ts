import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1144
  test('電話接触件数が負の値のとき、処理がエラーになること', () => {
    const input_params = {
      salesperson_id: 'SP-001',
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
      phone_contact_count: -5,
      email_contact_count: 10,
      visit_contact_count: 8,
      followup_interval_days: 3,
      contract_count: 2,
      contract_amount: 500000
    };

    expect(() => analyzeAndGenerateReport(input_params)).toThrow(/電話接触件数/);
  });
});