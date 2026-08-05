import { analyzeActionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析レポート生成機能', () => {
  // SCEN-523
  test('[normal] 営業担当者1名の商談実績データと行動ログが存在する場合、成功パターン・失敗パターン・成約率が正確に抽出される', () => {
    // Arrange
    const sales_rep_id = 'SA001';
    const deals = [
      {
        deal_id: 'D001',
        sales_rep_id: 'SA001',
        status: 'won',
        created_at: new Date('2024-01-10T09:00:00Z'),
      },
      {
        deal_id: 'D002',
        sales_rep_id: 'SA001',
        status: 'won',
        created_at: new Date('2024-01-12T10:30:00Z'),
      },
      {
        deal_id: 'D003',
        sales_rep_id: 'SA001',
        status: 'won',
        created_at: new Date('2024-01-15T14:00:00Z'),
      },
      {
        deal_id: 'D004',
        sales_rep_id: 'SA001',
        status: 'won',
        created_at: new Date('2024-01-18T11:00:00Z'),
      },
      {
        deal_id: 'D005',
        sales_rep_id: 'SA001',
        status: 'won',
        created_at: new Date('2024-01-20T15:30:00Z'),
      },
      {
        deal_id: 'D006',
        sales_rep_id: 'SA001',
        status: 'lost',
        created_at: new Date('2024-02-01T09:00:00Z'),
      },
      {
        deal_id: 'D007',
        sales_rep_id: 'SA001',
        status: 'lost',
        created_at: new Date('2024-02-05T10:00:00Z'),
      },
      {
        deal_id: 'D008',
        sales_rep_id: 'SA001',
        status: 'lost',
        created_at: new Date('2024-02-08T13:00:00Z'),
      },
      {
        deal_id: 'D009',
        sales_rep_id: 'SA001',
        status: 'lost',
        created_at: new Date('2024-02-10T11:30:00Z'),
      },
      {
        deal_id: 'D010',
        sales_rep_id: 'SA001',
        status: 'lost',
        created_at: new Date('2024-02-15T14:00:00Z'),
      },
    ];

    const action_logs = [
      // D001: won - initial contact 2024-01-10, proposal 2024-01-20, followup 3 times
      {
        deal_id: 'D001',
        action_type: 'initial_contact',
        timestamp: new Date('2024-01-10T09:00:00Z'),
      },
      {
        deal_id: 'D001',
        action_type: 'proposal',
        timestamp: new Date('2024-01-20T10:00:00Z'),
      },
      {
        deal_id: 'D001',
        action_type: 'followup',
        timestamp: new Date('2024-01-22T11:00:00Z'),
      },
      {
        deal_id: 'D001',
        action_type: 'followup',
        timestamp: new Date('2024-01-24T14:00:00Z'),
      },
      {
        deal_id: 'D001',
        action_type: 'followup',
        timestamp: new Date('2024-01-26T15:00:00Z'),
      },
      {
        deal_id: 'D001',
        action_type: 'call',
        duration_seconds: 1200,
        timestamp: new Date('2024-01-28T09:30:00Z'),
      },
      {
        deal_id: 'D001',
        action_type: 'email',
        timestamp: new Date('2024-01-29T10:00:00Z'),
      },
      // D002: won - initial contact 2024-01-12, proposal 2024-01-22, followup 3 times
      {
        deal_id: 'D002',
        action_type: 'initial_contact',
        timestamp: new Date('2024-01-12T10:30:00Z'),
      },
      {
        deal_id: 'D002',
        action_type: 'proposal',
        timestamp: new Date('2024-01-22T11:00:00Z'),
      },
      {
        deal_id: 'D002',
        action_type: 'followup',
        timestamp: new Date('2024-01-24T10:00:00Z'),
      },
      {
        deal_id: 'D002',
        action_type: 'followup',
        timestamp: new Date('2024-01-26T14:00:00Z'),
      },
      {
        deal_id: 'D002',
        action_type: 'followup',
        timestamp: new Date('2024-01-28T15:00:00Z'),
      },
      {
        deal_id: 'D002',
        action_type: 'email',
        timestamp: new Date('2024-01-30T09:00:00Z'),
      },
      // D003: won - initial contact 2024-01-15, proposal 2024-01-25, followup 3 times
      {
        deal_id: 'D003',
        action_type: 'initial_contact',
        timestamp: new Date('2024-01-15T14:00:00Z'),
      },
      {
        deal_id: 'D003',
        action_type: 'proposal',
        timestamp: new Date('2024-01-25T10:00:00Z'),
      },
      {
        deal_id: 'D003',
        action_type: 'followup',
        timestamp: new Date('2024-01-27T11:00:00Z'),
      },
      {
        deal_id: 'D003',
        action_type: 'followup',
        timestamp: new Date('2024-01-29T14:00:00Z'),
      },
      {
        deal_id: 'D003',
        action_type: 'followup',
        timestamp: new Date('2024-01-31T15:00:00Z'),
      },
      {
        deal_id: 'D003',
        action_type: 'call',
        duration_seconds: 900,
        timestamp: new Date('2024-02-02T09:30:00Z'),
      },
      // D004: won - initial contact 2024-01-18, proposal 2024-01-28, followup 3 times
      {
        deal_id: 'D004',
        action_type: 'initial_contact',
        timestamp: new Date('2024-01-18T11:00:00Z'),
      },
      {
        deal_id: 'D004',
        action_type: 'proposal',
        timestamp: new Date('2024-01-28T10:00:00Z'),
      },
      {
        deal_id: 'D004',
        action_type: 'followup',
        timestamp: new Date('2024-01-30T11:00:00Z'),
      },
      {
        deal_id: 'D004',
        action_type: 'followup',
        timestamp: new Date('2024-02-01T14:00:00Z'),
      },
      {
        deal_id: 'D004',
        action_type: 'followup',
        timestamp: new Date('2024-02-03T15:00:00Z'),
      },
      {
        deal_id: 'D004',
        action_type: 'email',
        timestamp: new Date('2024-02-04T10:00:00Z'),
      },
      // D005: won - initial contact 2024-01-20, proposal 2024-01-30, followup 3 times
      {
        deal_id: 'D005',
        action_type: 'initial_contact',
        timestamp: new Date('2024-01-20T15:30:00Z'),
      },
      {
        deal_id: 'D005',
        action_type: 'proposal',
        timestamp: new Date('2024-01-30T10:00:00Z'),
      },
      {
        deal_id: 'D005',
        action_type: 'followup',
        timestamp: new Date('2024-02-01T11:00:00Z'),
      },
      {
        deal_id: 'D005',
        action_type: 'followup',
        timestamp: new Date('2024-02-03T14:00:00Z'),
      },
      {
        deal_id: 'D005',
        action_type: 'followup',
        timestamp: new Date('2024-02-05T15:00:00Z'),
      },
      // D006: lost - initial contact 2024-02-01, proposal 2024-03-15 (42 days from initial contact)
      {
        deal_id: 'D006',
        action_type: 'initial_contact',
        timestamp: new Date('2024-02-01T09:00:00Z'),
      },
      {
        deal_id: 'D006',
        action_type: 'proposal',
        timestamp: new Date('2024-03-15T10:00:00Z'),
      },
      {
        deal_id: 'D006',
        action_type: 'followup',
        timestamp: new Date('2024-03-17T11:00:00Z'),
      },
      // D007: lost - initial contact 2024-02-05, proposal 2024-03-20 (43 days from initial contact)
      {
        deal_id: 'D007',
        action_type: 'initial_contact',
        timestamp: new Date('2024-02-05T10:00:00Z'),
      },
      {
        deal_id: 'D007',
        action_type: 'proposal',
        timestamp: new Date('2024-03-20T10:00:00Z'),
      },
      {
        deal_id: 'D007',
        action_type: 'followup',
        timestamp: new Date('2024-03-22T11:00:00Z'),
      },
      // D008: lost - initial contact 2024-02-08, proposal 2024-03-25 (45 days from initial contact)
      {
        deal_id: 'D008',
        action_type: 'initial_contact',
        timestamp: new Date('2024-02-08T13:00:00Z'),
      },
      {
        deal_id: 'D008',
        action_type: 'proposal',
        timestamp: new Date('2024-03-25T10:00:00Z'),
      },
      {
        deal_id: 'D008',
        action_type: 'followup',
        timestamp: new Date('2024-03-27T11:00:00Z'),
      },
      // D009: lost - initial contact 2024-02-10, proposal 2024-03-30 (48 days from initial contact)
      {
        deal_id: 'D009',
        action_type: 'initial_contact',
        timestamp: new Date('2024-02-10T11:30:00Z'),
      },
      {
        deal_id: 'D009',
        action_type: 'proposal',
        timestamp: new Date('2024-03-30T10:00:00Z'),
      },
      {
        deal_id: 'D009',
        action_type: 'followup',
        timestamp: new Date('2024-04-01T11:00:00Z'),
      },
      // D010: lost - initial contact 2024-02-15, proposal 2024-04-05 (49 days from initial contact)
      {
        deal_id: 'D010',
        action_type: 'initial_contact',
        timestamp: new Date('2024-02-15T14:00:00Z'),
      },
      {
        deal_id: 'D010',
        action_type: 'proposal',
        timestamp: new Date('2024-04-05T10:00:00Z'),
      },
      {
        deal_id: 'D010',
        action_type: 'followup',
        timestamp: new Date('2024-04-07T11:00:00Z'),
      },
    ];

    // Act
    const report = analyzeActionPatterns(sales_rep_id, deals, action_logs);

    // Assert
    // 成約率: 5件 / 10件 = 50%
    expect(report.win_rate).toBe(50);

    // 成功パターンの検証
    // 成功パターン: フォローアップ回数3回以上かつ提案から成約まで14日以内
    expect(report.success_pattern).toEqual({
      followup_count_min: 3,
      days_proposal_to_close_max: 14,
      characteristic: 'followup_3plus_and_proposal_to_close_14days_or_less',
    });

    // 失敗パターンの検証
    // 失敗パターン: 初回接触から提案までが30日以上
    expect(report.failure_pattern).toEqual({
      days_initial_to_proposal_min: 30,
      characteristic: 'initial_contact_to_proposal_30days_or_more',
    });

    // レポートオブジェクトの構造確認
    expect(report.sales_rep_id).toBe('SA001');
    expect(report.total_deals).toBe(10);
    expect(report.won_deals).toBe(5);
    expect(report.lost_deals).toBe(5);
  });
});