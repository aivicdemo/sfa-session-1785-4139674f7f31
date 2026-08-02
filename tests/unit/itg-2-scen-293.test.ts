import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-293
  test('成約ステップの日付が空値のとき、スコア計算がエラーになる', () => {
    const sales_data = {
      initial_contact_date: new Date('2024-01-15T10:00:00Z'),
      proposal_date: new Date('2024-01-20T14:30:00Z'),
      negotiation_date: new Date('2024-01-25T09:15:00Z'),
      contract_date: null,
      salesperson_id: 'SP001',
    };

    expect(() => calculateProcessComplianceScore(sales_data)).toThrow(
      /成約ステップの日付|Cannot read property|null/
    );
  });
});