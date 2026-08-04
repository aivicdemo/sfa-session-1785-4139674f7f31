import { deduplicateHistoryByLatest } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-400
  test('推論精度検証機能 - 推奨履歴データに同じ顧客ID・商談IDの重複レコードが含まれるとき、最新の1件を優先使用', () => {
    const customerId = 'CUST001';
    const dealId = 'DEAL001';

    const duplicateHistories = [
      {
        recommendation_id: 'REC-001',
        customer_id: customerId,
        deal_id: dealId,
        created_at: new Date('2026-01-01T10:00:00Z'),
        confidence_score: 75,
        approach_content: 'Initial approach',
      },
      {
        recommendation_id: 'REC-002',
        customer_id: customerId,
        deal_id: dealId,
        created_at: new Date('2026-01-15T14:30:00Z'),
        confidence_score: 82,
        approach_content: 'Updated approach',
      },
      {
        recommendation_id: 'REC-003',
        customer_id: customerId,
        deal_id: dealId,
        created_at: new Date('2026-01-20T09:15:00Z'),
        confidence_score: 88,
        approach_content: 'Latest approach',
      },
    ];

    const result = deduplicateHistoryByLatest(customerId, dealId, duplicateHistories);

    expect(result).toHaveLength(1);
    expect(result[0].recommendation_id).toBe('REC-003');
    expect(result[0].created_at).toEqual(new Date('2026-01-20T09:15:00Z'));
    expect(result[0].customer_id).toBe('CUST001');
    expect(result[0].deal_id).toBe('DEAL001');
  });
});