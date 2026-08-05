import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-227: [error] 標準プロセス遵守度スコア計算機能 - 商談記録の顧客IDが null のときエラーになる
  test('should throw error when customer_id is null in deal record', () => {
    const deal_record = {
      deal_id: 'DEAL-001',
      deal_name: 'Enterprise Package Proposal',
      customer_id: null,
      amount: 500000,
      stage: 'proposal',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      sales_person_id: 'SP-123',
      contact_frequency: 5,
      proposal_count: 2,
      follow_up_interval_days: 7
    };

    expect(() => calculateProcessComplianceScore(deal_record)).toThrow(/顧客ID/);
  });
});