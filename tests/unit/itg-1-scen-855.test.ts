import { analyzeCorrelationBetweenProcessDeviationAndContractResult } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-855
  test('営業担当者IDが未入力の場合、エラーを発生させる', () => {
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');
    const contractResultDataset = [
      {
        contract_id: 'C001',
        sales_rep_id: 'SR001',
        contract_amount: 1000000,
        contract_date: new Date('2024-01-15T10:00:00Z'),
        customer_id: 'CUS001'
      }
    ];

    expect(() =>
      analyzeCorrelationBetweenProcessDeviationAndContractResult({
        sales_rep_id: null,
        analysis_start_date: analysisStartDate,
        analysis_end_date: analysisEndDate,
        contract_result_dataset: contractResultDataset
      })
    ).toThrow(/営業担当者ID/);
  });
});