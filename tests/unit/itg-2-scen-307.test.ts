import { detectDeviationPatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-307
  test('[error] 乖離パターン検出 - 乖離パターン定義マスタが0件のとき、エラーになる', () => {
    const salesRecords = [
      {
        sales_rep_id: 'SR001',
        deal_id: 'DEAL001',
        customer_id: 'CUST001',
        initial_contact_date: '2024-01-10',
        proposal_date: '2024-01-15',
        negotiation_date: null,
        closing_date: null,
        created_at: '2024-01-10T09:00:00Z'
      }
    ];

    const deviationPatternMaster = [];

    expect(() => {
      detectDeviationPatterns(salesRecords, deviationPatternMaster);
    }).toThrow(/乖離パターン定義マスタ/);
  });
});