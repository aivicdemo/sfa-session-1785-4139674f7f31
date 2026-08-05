import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { calculateDeviationAndDeterminePriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-265: [normal] 行動パターン分析と改善指導優先順位判定機能 - 商談進捗が複数件、提案内容が0件、顧客接触頻度が複数件の組み合わせで乖離度が計算され、改善指導内容が判定される
  test('should calculate deviation score and determine improvement priority when dealing_progress has multiple items, proposal_count is zero, and customer_contact_frequency has multiple items', () => {
    // Arrange: テスト対象の行動パターン分析機能を初期化し、入力データを準備
    const dealing_progress_data = [
      {
        id: 'dp_001',
        status: 'initial_contact',
        timestamp: new Date('2024-01-15T09:00:00Z'),
      },
      {
        id: 'dp_002',
        status: 'proposal_phase',
        timestamp: new Date('2024-01-16T10:30:00Z'),
      },
    ];

    const proposal_content_data: Array<{
      id: string;
      content: string;
      timestamp: Date;
    }> = [];

    const customer_contact_frequency_data = [
      {
        id: 'ccf_001',
        frequency_level: 1,
        contact_count: 3,
        period_days: 30,
      },
      {
        id: 'ccf_002',
        frequency_level: 2,
        contact_count: 5,
        period_days: 30,
      },
    ];

    // Act: 乖離度計算エンジンを実行し、改善指導優先順位判定ロジックを呼び出す
    const result = calculateDeviationAndDeterminePriority({
      dealing_progress: dealing_progress_data,
      proposal_count: proposal_content_data.length,
      customer_contact_frequency: customer_contact_frequency_data,
      standard_process_definition: {
        expected_proposal_phase_days: 7,
        expected_contact_frequency_per_month: 4,
      },
    });

    // Assert: 判定結果の改善指導内容を確認
    // 期待結果：
    // - 乖離度が0.0以上1.0以下の数値で計算される
    // - 提案内容が0件なので、改善指導優先順位が『提案内容作成の優先実施』と判定される
    expect(result.deviation_score).toBeGreaterThanOrEqual(0.0);
    expect(result.deviation_score).toBeLessThanOrEqual(1.0);
    expect(result.improvement_priority_guidance).toBe(
      '提案内容作成の優先実施'
    );
    expect(result.dealing_progress_count).toBe(2);
    expect(result.customer_contact_frequency_count).toBe(2);
  });
});