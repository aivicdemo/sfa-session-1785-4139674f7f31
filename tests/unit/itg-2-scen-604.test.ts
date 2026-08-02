import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-604
  test('妥当性検証で日付が月末日の場合、合格と判定される', () => {
    const salesDataRecords = [
      {
        id: 'record_001',
        customer_id: 'cust_12345',
        contact_date: '2024-02-29',
        proposal_date: '2024-02-29',
        contract_date: '2024-02-29',
        sales_amount: 150000,
        status: null,
        error_message: null,
      },
      {
        id: 'record_002',
        customer_id: 'cust_67890',
        contact_date: '2024-12-31',
        proposal_date: '2024-12-31',
        contract_date: '2024-12-31',
        sales_amount: 250000,
        status: null,
        error_message: null,
      },
    ];

    const result = validateSalesDataQuality(salesDataRecords);

    expect(result).toEqual({
      validation_status: 'PASS',
      records: [
        {
          id: 'record_001',
          customer_id: 'cust_12345',
          contact_date: '2024-02-29',
          proposal_date: '2024-02-29',
          contract_date: '2024-02-29',
          sales_amount: 150000,
          status: 'validation_passed',
          error_message: null,
        },
        {
          id: 'record_002',
          customer_id: 'cust_67890',
          contact_date: '2024-12-31',
          proposal_date: '2024-12-31',
          contract_date: '2024-12-31',
          sales_amount: 250000,
          status: 'validation_passed',
          error_message: null,
        },
      ],
      error_count: 0,
      passed_count: 2,
    });

    expect(result.records[0].status).toBe('validation_passed');
    expect(result.records[0].error_message).toBeNull();
    expect(result.records[1].status).toBe('validation_passed');
    expect(result.records[1].error_message).toBeNull();
  });
});