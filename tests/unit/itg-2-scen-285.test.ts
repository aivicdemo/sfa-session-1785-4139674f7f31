import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-285
  test('初回接触ステップが商談記録から欠落しているとき、スコア計算がエラーになる', () => {
    const dealRecordWithoutInitialContact = {
      deal_id: 'DEAL-001',
      sales_rep_id: 'REP-001',
      customer_id: 'CUST-001',
      touchpoints: [
        {
          touchpoint_type: 'needs_analysis',
          executed_date: '2024-01-10T09:00:00Z',
          sequence_number: 1,
        },
        {
          touchpoint_type: 'proposal',
          executed_date: '2024-01-15T10:00:00Z',
          sequence_number: 2,
        },
        {
          touchpoint_type: 'closing',
          executed_date: '2024-01-20T14:00:00Z',
          sequence_number: 3,
        },
      ],
    };

    expect(() =>
      calculateProcessComplianceScore(dealRecordWithoutInitialContact)
    ).toThrow(/初回接触ステップ/);
  });
});