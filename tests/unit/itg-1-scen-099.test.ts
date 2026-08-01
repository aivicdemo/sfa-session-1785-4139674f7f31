import { validateLearningDataBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ量・品質検証機能', () => {
  // SCEN-099: [edge] AIエージェント推論実行前の学習データ量・品質検証機能 - 営業活動ログの品質スコアが良好ライン直上の場合、推論実行が許可される
  test('品質スコアが良好ライン値(75点)の場合、推論実行が許可される', () => {
    const sales_activity_logs = [
      {
        id: 'log_001',
        salesperson_id: 'sp_001',
        customer_id: 'cust_001',
        activity_type: 'visit',
        activity_date: new Date('2024-01-15T10:00:00Z'),
        notes: 'Initial customer contact',
        created_at: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 'log_002',
        salesperson_id: 'sp_001',
        customer_id: 'cust_001',
        activity_type: 'phone_call',
        activity_date: new Date('2024-01-16T14:00:00Z'),
        notes: 'Follow-up discussion',
        created_at: new Date('2024-01-16T14:30:00Z'),
      },
      {
        id: 'log_003',
        salesperson_id: 'sp_002',
        customer_id: 'cust_002',
        activity_type: 'email',
        activity_date: new Date('2024-01-17T09:00:00Z'),
        notes: 'Proposal sent',
        created_at: new Date('2024-01-17T09:15:00Z'),
      },
    ];

    const quality_score = 75;
    const quality_threshold = 75;
    const minimum_data_count = 3;

    const result = validateLearningDataBeforeInference({
      sales_activity_logs,
      quality_score,
      quality_threshold,
      minimum_data_count,
    });

    expect(result.inference_permitted).toBe(true);
    expect(result.quality_score).toBe(75);
    expect(result.quality_check_passed).toBe(true);
    expect(result.data_volume_check_passed).toBe(true);
    expect(result.status).toBe('推論実行可能');
    expect(result.message).toContain('品質スコア');
  });
});