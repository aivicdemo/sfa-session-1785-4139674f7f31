import { calculateProcessComplianceScoreByUser } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-272
  test('商談記録が複数件のとき、営業担当者ごとのスコアが個別に計算される', () => {
    const deal_records = [
      {
        deal_record_id: 'deal_001',
        sales_user_id: 'user_A',
        deal_name: '案件A',
        progress_status: '提案済み',
        memo: '顧客との初回打ち合わせ実施',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        deal_record_id: 'deal_002',
        sales_user_id: 'user_A',
        deal_name: '案件B',
        progress_status: 'ヒアリング中',
        memo: '',
        created_at: new Date('2024-01-16T14:30:00Z'),
      },
      {
        deal_record_id: 'deal_003',
        sales_user_id: 'user_B',
        deal_name: '案件C',
        progress_status: '提案済み',
        memo: '提案資料を提示済み',
        created_at: new Date('2024-01-17T09:00:00Z'),
      },
    ];

    const result = calculateProcessComplianceScoreByUser(deal_records);

    expect(result).toHaveProperty('user_A');
    expect(result).toHaveProperty('user_B');
    expect(typeof result.user_A).toBe('number');
    expect(typeof result.user_B).toBe('number');
    expect(result.user_A).not.toEqual(result.user_B);
    expect(result.user_A).toBeGreaterThanOrEqual(0);
    expect(result.user_A).toBeLessThanOrEqual(100);
    expect(result.user_B).toBeGreaterThanOrEqual(0);
    expect(result.user_B).toBeLessThanOrEqual(100);
  });
});