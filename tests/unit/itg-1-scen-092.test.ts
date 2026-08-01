import { validateLearningDataQuality } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ品質検証', () => {
  // SCEN-092
  test('営業担当者データが欠落している場合、学習データの品質検証に失敗する', () => {
    const learning_data_records = [
      {
        sales_opportunity_id: 'OPP-001',
        sales_rep_id: 'SR-001',
        customer_id: 'CUST-001',
        proposal_amount: 500000,
        proposal_date: '2024-01-15',
        contract_date: '2024-02-01',
      },
      {
        sales_opportunity_id: 'OPP-002',
        sales_rep_id: null,
        customer_id: 'CUST-002',
        proposal_amount: 300000,
        proposal_date: '2024-01-20',
        contract_date: null,
      },
      {
        sales_opportunity_id: 'OPP-003',
        sales_rep_id: '',
        customer_id: 'CUST-003',
        proposal_amount: 750000,
        proposal_date: '2024-01-25',
        contract_date: '2024-02-10',
      },
    ];

    const result = validateLearningDataQuality(learning_data_records);

    expect(result.status).toBe('FAILED');
    expect(result.missing_field_name).toBe('営業担当者ID');
    expect(result.missing_record_count).toBe(2);
    expect(result.error_message).toMatch(/営業担当者/);
  });
});