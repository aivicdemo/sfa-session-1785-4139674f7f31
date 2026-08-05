import { describe, it, expect, beforeEach } from '@jest/globals';
import { aggregateComprehensionScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の理解度スコア集計機能', () => {
  // SCEN-1005
  it('[normal] 理解度確認テスト提出が複数件の場合、全営業担当者のスコアが正しく集計される', () => {
    // Setup: 営業担当者A、B、Cの理解度確認テスト結果
    const comprehension_records = [
      {
        sales_staff_id: 'staff_a',
        sales_staff_name: '営業担当者A',
        test_submission_id: 'test_001',
        score: 85,
        submitted_at: '2024-01-10T09:00:00Z',
      },
      {
        sales_staff_id: 'staff_a',
        sales_staff_name: '営業担当者A',
        test_submission_id: 'test_002',
        score: 85,
        submitted_at: '2024-01-11T09:00:00Z',
      },
      {
        sales_staff_id: 'staff_b',
        sales_staff_name: '営業担当者B',
        test_submission_id: 'test_003',
        score: 92,
        submitted_at: '2024-01-12T09:00:00Z',
      },
      {
        sales_staff_id: 'staff_b',
        sales_staff_name: '営業担当者B',
        test_submission_id: 'test_004',
        score: 92,
        submitted_at: '2024-01-13T09:00:00Z',
      },
      {
        sales_staff_id: 'staff_b',
        sales_staff_name: '営業担当者B',
        test_submission_id: 'test_005',
        score: 92,
        submitted_at: '2024-01-14T09:00:00Z',
      },
      {
        sales_staff_id: 'staff_c',
        sales_staff_name: '営業担当者C',
        test_submission_id: 'test_006',
        score: 78,
        submitted_at: '2024-01-15T09:00:00Z',
      },
    ];

    // Execute: 集計機能を実行
    const result = aggregateComprehensionScores(comprehension_records);

    // Verify: 営業担当者ごとの平均スコア
    expect(result.staff_scores).toEqual([
      {
        sales_staff_id: 'staff_a',
        sales_staff_name: '営業担当者A',
        average_score: 85.0,
        submission_count: 2,
      },
      {
        sales_staff_id: 'staff_b',
        sales_staff_name: '営業担当者B',
        average_score: 92.0,
        submission_count: 3,
      },
      {
        sales_staff_id: 'staff_c',
        sales_staff_name: '営業担当者C',
        average_score: 78.0,
        submission_count: 1,
      },
    ]);

    // Verify: 全体集計結果
    expect(result.total_submission_count).toBe(6);
    expect(result.overall_average_score).toBe(85.17);
  });
});