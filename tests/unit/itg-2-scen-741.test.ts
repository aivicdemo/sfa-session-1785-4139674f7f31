import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-741
  test('購買シグナル強度算出機能 - 過去商談記録が複数件のとき、購買シグナル強度が正しく算出される', () => {
    const customer_id = 'CUST-001';
    const deal_records = [
      {
        deal_id: 'DEAL-001',
        customer_id: customer_id,
        deal_date: '2024-01-10T10:00:00Z',
        deal_amount: 50000,
        deal_stage: 'inquiry',
        inquiry_count: 3,
        response_rate: 0.8,
        proposal_views: 0,
        view_time_minutes: 0,
        email_open_rate: 0,
        email_click_rate: 0,
      },
      {
        deal_id: 'DEAL-002',
        customer_id: customer_id,
        deal_date: '2024-01-20T14:30:00Z',
        deal_amount: 75000,
        deal_stage: 'proposal',
        inquiry_count: 0,
        response_rate: 0,
        proposal_views: 2,
        view_time_minutes: 15,
        email_open_rate: 0,
        email_click_rate: 0,
      },
      {
        deal_id: 'DEAL-003',
        customer_id: customer_id,
        deal_date: '2024-01-28T09:15:00Z',
        deal_amount: 100000,
        deal_stage: 'negotiation',
        inquiry_count: 0,
        response_rate: 0,
        proposal_views: 0,
        view_time_minutes: 0,
        email_open_rate: 0.9,
        email_click_rate: 0.4,
      },
    ];

    const result = calculatePurchaseSignalStrength(customer_id, deal_records);

    expect(result.signal_strength_score).toBe(72.5);
    expect(result.signal_strength_score).toBeGreaterThanOrEqual(0);
    expect(result.signal_strength_score).toBeLessThanOrEqual(100);
    expect(result.weighted_by_recency).toBe(true);
    expect(result.latest_deal_id).toBe('DEAL-003');
  });
});