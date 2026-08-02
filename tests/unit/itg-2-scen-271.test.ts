import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-271
  test('[normal] 標準プロセス遵守度スコア計算 - 商談記録が1件のとき、該当営業担当者のスコアが正しく計算される', () => {
    const userId = 'USER001';
    const dealId = 'DEAL-001';
    const completedItems = 7;
    const totalItems = 8;
    const expectedScore = 87.5;

    const dealRecords = [
      {
        deal_id: dealId,
        user_id: userId,
        customer_id: 'CUST-001',
        deal_name: 'テスト商談',
        process_completed_items: completedItems,
        process_total_items: totalItems,
        created_at: new Date('2024-01-15T10:00:00Z'),
        updated_at: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const result = calculateProcessComplianceScore(userId, dealRecords);

    expect(result).toEqual({
      user_id: userId,
      compliance_score: expectedScore,
      total_deals: 1,
      completed_items: completedItems,
      total_items: totalItems,
    });
    expect(result.compliance_score).toBe(87.5);
  });
});