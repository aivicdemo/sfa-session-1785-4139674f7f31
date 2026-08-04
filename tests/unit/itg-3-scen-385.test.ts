import { calculateAccuracyMetrics } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度検証 - 月次周期の直近30日集計', () => {
  test('SCEN-385: 月次設定時に直近30日間のデータを正確に集計対象として処理する', () => {
    // ===== テスト前提条件 =====
    // 現在日時を 2026-01-15T12:00:00 JST に固定
    const fixed_now = new Date('2026-01-15T03:00:00Z'); // JST 12:00 = UTC 03:00
    const original_now = Date.now;
    global.Date.now = jest.fn(() => fixed_now.getTime());

    try {
      // ===== テストデータ準備 =====
      // 月次検証ルール設定
      const verification_config = {
        verification_cycle: 'monthly',
        enabled: true,
      };

      // 集計対象範囲の期待値: 2026-01-15 から遡って 30 日前の 2025-12-16
      // 期待範囲: 2025-12-16T00:00:00Z ～ 2026-01-15T23:59:59Z
      const expected_start_date = new Date('2025-12-16T00:00:00Z');
      const expected_end_date = new Date('2026-01-15T23:59:59Z');

      // テストデータセット
      // 対象外: 2025-12-15 (範囲開始前)
      const data_point_outside_before = {
        recommendation_id: 'rec-001',
        created_at: new Date('2025-12-15T10:00:00Z'),
        accuracy_score: 85,
        user_feedback: 'positive',
      };

      // 対象内: 2025-12-18 (範囲内)
      const data_point_inside_1 = {
        recommendation_id: 'rec-002',
        created_at: new Date('2025-12-18T10:00:00Z'),
        accuracy_score: 90,
        user_feedback: 'positive',
      };

      // 対象内: 2025-12-28 (範囲内)
      const data_point_inside_2 = {
        recommendation_id: 'rec-003',
        created_at: new Date('2025-12-28T15:30:00Z'),
        accuracy_score: 78,
        user_feedback: 'neutral',
      };

      // 対象内: 2026-01-10 (範囲内)
      const data_point_inside_3 = {
        recommendation_id: 'rec-004',
        created_at: new Date('2026-01-10T09:15:00Z'),
        accuracy_score: 88,
        user_feedback: 'positive',
      };

      // 対象外: 2026-01-16 (範囲終了後)
      const data_point_outside_after = {
        recommendation_id: 'rec-005',
        created_at: new Date('2026-01-16T14:00:00Z'),
        accuracy_score: 82,
        user_feedback: 'negative',
      };

      // すべてのテストデータ
      const all_data_points = [
        data_point_outside_before,
        data_point_inside_1,
        data_point_inside_2,
        data_point_inside_3,
        data_point_outside_after,
      ];

      // ===== 関数実行 =====
      const result = calculateAccuracyMetrics(
        verification_config,
        all_data_points
      );

      // ===== アサーション検証 =====
      // 1. 集計対象期間の検証
      expect(result.aggregation_start_date).toEqual(expected_start_date);
      expect(result.aggregation_end_date).toEqual(expected_end_date);

      // 2. 集計対象データ件数の検証（対象内のデータは3件）
      expect(result.dataPointCount).toBe(3);

      // 3. 集計対象に含まれるべきレコード IDを検証
      const included_recommendation_ids = result.included_data_points.map(
        (dp: { recommendation_id: string }) => dp.recommendation_id
      );
      expect(included_recommendation_ids).toContain('rec-002');
      expect(included_recommendation_ids).toContain('rec-003');
      expect(included_recommendation_ids).toContain('rec-004');

      // 4. 集計対象外のレコード ID が含まれていないことを検証
      expect(included_recommendation_ids).not.toContain('rec-001'); // 範囲前
      expect(included_recommendation_ids).not.toContain('rec-005'); // 範囲後

      // 5. 集計対象外データ件数の検証
      expect(result.excluded_data_points_count).toBe(2);

      // 6. 平均精度スコアの検証
      // (90 + 78 + 88) / 3 = 256 / 3 = 85.333...
      const expected_avg_accuracy = (90 + 78 + 88) / 3;
      expect(result.average_accuracy_score).toBeCloseTo(expected_avg_accuracy, 2);

      // 7. ポジティブフィードバック件数の検証
      // rec-002: positive, rec-003: neutral, rec-004: positive = 2件
      expect(result.positive_feedback_count).toBe(2);
    } finally {
      // ===== テスト後処理 =====
      global.Date.now = original_now;
    }
  });
});