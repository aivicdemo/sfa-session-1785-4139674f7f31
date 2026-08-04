import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨履歴記録機能 - 月末月初境界での正確なタイムスタンプ記録', () => {
  // SCEN-186
  test('推奨実行時刻が月末から月初にまたがる場合、タイムスタンプと実行日付が正確に記録される', () => {
    // テスト用の固定日時設定：2026年2月28日 23時59分59秒
    const execution_timestamp_before_rollover = new Date('2026-02-28T23:59:59Z');

    // AIRecommendationEngineスタブ設定：推奨生成成功
    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-12345',
        customer_id: 'TEST-001',
        case_id: 'CASE-001',
        approach: 'premium_proposal',
        confidence_score: 85,
        reasoning: 'Similar pattern detected in past cases',
      }),
    };

    // テスト用推奨実行リクエスト
    const recommendation_request = {
      customer_id: 'TEST-001',
      case_id: 'CASE-001',
      user_id: 'USER-123',
      requested_at: execution_timestamp_before_rollover.toISOString(),
    };

    // システムクロック進行：月末から月初へ
    // 実行完了時刻：2026年3月1日 00時00分01秒
    const execution_timestamp_after_rollover = new Date('2026-03-01T00:00:01Z');

    // 推奨履歴記録実行
    const recorded_history = recordRecommendationHistory({
      recommendation_id: 'REC-12345',
      customer_id: 'TEST-001',
      case_id: 'CASE-001',
      user_id: 'USER-123',
      execution_timestamp: execution_timestamp_after_rollover.toISOString(),
      status: 'completed',
      confidence_score: 85,
    });

    // 検証1: timestampカラムが正確なISO 8601形式で記録されているか
    expect(recorded_history.timestamp).toBe('2026-03-01T00:00:01Z');

    // 検証2: execution_dateカラムが'2026-03-01'という文字列で格納されているか
    expect(recorded_history.execution_date).toBe('2026-03-01');

    // 検証3: 推奨IDが正確に記録されているか
    expect(recorded_history.recommendation_id).toBe('REC-12345');

    // 検証4: ユーザーIDが正確に記録されているか
    expect(recorded_history.user_id).toBe('USER-123');

    // 検証5: statusが通常形式で記録されているか
    expect(recorded_history.status).toBe('completed');

    // 検証6: 信頼度スコアが数値で記録されているか
    expect(recorded_history.confidence_score).toBe(85);

    // 検証7: 記録全体の構造が正確であるか
    expect(recorded_history).toEqual({
      timestamp: '2026-03-01T00:00:01Z',
      execution_date: '2026-03-01',
      recommendation_id: 'REC-12345',
      customer_id: 'TEST-001',
      case_id: 'CASE-001',
      user_id: 'USER-123',
      status: 'completed',
      confidence_score: 85,
    });
  });
});