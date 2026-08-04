import { validateRecommendationApproval } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2870
  test('[error] 推奨内容検証判定機能 - 営業管理職の検証日時が未来日のとき、エラーを返す', () => {
    const current_timestamp = '2026-08-01T10:00:00Z';
    const future_validation_timestamp = '2026-08-02T15:30:00Z';

    const input = {
      recommendation_id: 'REC-20260801-001',
      validation_timestamp: future_validation_timestamp,
      manager_approval_status: 'PENDING_REVIEW',
      recommendation_content: {
        approach: 'Follow-up meeting proposal',
        timing: '2026-08-10',
        confidence_score: 85,
      },
    };

    const expected_error = {
      code: 'VALIDATION_DATE_IN_FUTURE',
      message: '検証日時は現在時刻以前の日時で設定してください',
      timestamp: current_timestamp,
    };

    try {
      validateRecommendationApproval(input, current_timestamp);
      fail('Should have thrown an error');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string; timestamp?: string };
      expect(err.code).toBe('VALIDATION_DATE_IN_FUTURE');
      expect(err.message).toMatch(/検証日時/);
    }
  });
});