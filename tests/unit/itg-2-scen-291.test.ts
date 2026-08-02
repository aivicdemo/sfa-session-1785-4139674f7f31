import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-291
  test('標準プロセス遵守度スコア計算 - 提案ステップの日付が空値のときエラーになる', () => {
    const deal_data = {
      deal_id: 'DEAL-001',
      customer_name: 'ABC Corporation',
      amount: 5000000,
      initial_contact_date: '2024-01-10T09:00:00Z',
      proposal_date: null,
      negotiation_date: '2024-01-20T14:30:00Z',
      contract_date: '2024-01-25T11:00:00Z',
    };

    expect(() => calculateProcessComplianceScore(deal_data)).toThrow(/提案ステップの日付/);
  });
});