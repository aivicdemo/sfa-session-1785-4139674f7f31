import { analyzeContractAcquisitionCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1188
  test('成約実績相関分析機能 - 成約実績データが null のとき処理がエラーになる', () => {
    const null_contract_results = null;
    const sales_process_data = {
      sales_rep_id: 'SR001',
      activity_date: '2024-01-15T10:00:00Z',
      visit_frequency: 5,
      proposal_success_rate: 0.75,
      followup_interval_days: 3,
    };

    expect(() => {
      analyzeContractAcquisitionCorrelation(null_contract_results, sales_process_data);
    }).toThrow(/成約実績/);
  });
});