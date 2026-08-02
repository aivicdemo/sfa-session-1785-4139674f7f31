import { validateFiscalYearBoundary } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-419
  test('年度をまたぐ商談記録の入力漏れが検出される', () => {
    const dealIdContinued = 'DEAL-20240001';
    const dealIdFollowUp = 'DEAL-20250001';
    
    const fy2024Records = [
      {
        deal_id: dealIdContinued,
        customer_id: 'CUST-001',
        deal_start_date: new Date('2024-06-15T09:00:00Z'),
        deal_end_date: null,
        fiscal_year: 2024,
        deal_status: 'ongoing',
        deal_amount: 5000000
      }
    ];

    const fy2025Records = [
      {
        deal_id: dealIdFollowUp,
        customer_id: 'CUST-001',
        deal_start_date: new Date('2025-04-01T09:00:00Z'),
        deal_end_date: null,
        fiscal_year: 2025,
        deal_status: 'ongoing',
        deal_amount: 5000000
      }
    ];

    const validationResult = validateFiscalYearBoundary({
      fy2024_deals: fy2024Records,
      fy2025_deals: fy2025Records,
      continuation_customer_ids: ['CUST-001']
    });

    expect(validationResult.errors).toHaveLength(1);
    expect(validationResult.errors[0]).toEqual({
      deal_id: dealIdContinued,
      error_code: 'ERR_FISCAL_YEAR_BOUNDARY_MISSING',
      message: `年度をまたぐ商談の終了日が入力漏れされています。商談ID: ${dealIdContinued}、2024年度レコードの終了日を設定してください`,
      severity: 'HIGH'
    });
  });
});