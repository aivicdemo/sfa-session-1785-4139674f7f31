import { validateLearningDataBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-102
  test('[normal] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データが複数件で一部のデータの品質が不良の場合、推論実行が保留される', () => {
    // 学習データストア準備：5件のレコード
    const learningDataStore = [
      {
        record_id: 'LRN001',
        quality_score: 0.85,
        data_type: 'sales_activity',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        record_id: 'LRN002',
        quality_score: 0.92,
        data_type: 'sales_activity',
        created_at: new Date('2024-01-15T11:00:00Z'),
      },
      {
        record_id: 'LRN003',
        quality_score: 0.88,
        data_type: 'sales_outcome',
        created_at: new Date('2024-01-15T12:00:00Z'),
      },
      {
        record_id: 'LRN004',
        quality_score: 0.75,
        data_type: 'sales_activity',
        created_at: new Date('2024-01-15T13:00:00Z'),
      },
      {
        record_id: 'LRN005',
        quality_score: 0.72,
        data_type: 'sales_outcome',
        created_at: new Date('2024-01-15T14:00:00Z'),
      },
    ];

    // 推論実行前の検証処理を呼び出す
    const validationResult = validateLearningDataBeforeInference({
      learning_data_records: learningDataStore,
      quality_threshold: 0.8,
      minimum_record_count: 1,
    });

    // 期待結果の検証
    // (1) 全体ステータスが「保留（PENDING）」
    expect(validationResult.status).toBe('PENDING');

    // (2) 推論実行フラグが「false」
    expect(validationResult.inference_executable).toBe(false);

    // (3) 検証理由が「学習データの一部に品質不良が検出されました。品質不良件数:2件」
    expect(validationResult.validation_reason).toBe(
      '学習データの一部に品質不良が検出されました。品質不良件数:2件'
    );

    // (4) 不合格データの詳細情報に品質スコア値と該当レコードIDが含まれていること
    expect(validationResult.failed_data_details).toEqual([
      {
        record_id: 'LRN004',
        quality_score: 0.75,
        reason: 'quality_threshold_not_met',
      },
      {
        record_id: 'LRN005',
        quality_score: 0.72,
        reason: 'quality_threshold_not_met',
      },
    ]);

    // 全体統計の検証
    expect(validationResult.total_records).toBe(5);
    expect(validationResult.passed_records).toBe(3);
    expect(validationResult.failed_records).toBe(2);
  });
});