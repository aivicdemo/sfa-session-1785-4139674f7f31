import { analyzeActionPatternAndSalesResult } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-679
  test('提案実行日時が不正な日付形式のとき時系列分析がエラーになる', () => {
    const invalid_proposal_records = [
      {
        proposal_id: 'PROP001',
        salesperson_id: 'SP001',
        customer_id: 'CUST001',
        proposal_execution_datetime: '2024-13-45',
        proposal_content: 'テスト提案',
        contract_status: 'PENDING',
        contract_amount: 100000,
      },
    ];

    expect(() =>
      analyzeActionPatternAndSalesResult({
        proposal_records: invalid_proposal_records,
        analysis_period_start: '2024-01-01',
        analysis_period_end: '2024-12-31',
      })
    ).toThrow(/提案実行日時の形式が不正です/);
  });
});