import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1657
  test('[error] 推奨スコア算出機能 - 購買履歴の期間が不正な日付範囲 (終了日が開始日より前) のとき、エラーが発生する', () => {
    const purchase_history_start_date = '2026-01-15';
    const purchase_history_end_date = '2026-01-10';
    const customer_id = 'CUST001';
    const proposal_content = 'test proposal';

    const input = {
      customer_id,
      proposal_content,
      purchase_history_start_date,
      purchase_history_end_date,
    };

    const error_response = calculateRecommendationScore(input);

    expect(error_response.error_code).toBe('INVALID_DATE_RANGE');
    expect(error_response.http_status_code).toBe(400);
    expect(error_response.error_message).toMatch(/購買履歴の終了日は開始日以降の日付を指定してください/);
    expect(error_response.score).toBeUndefined();
    expect(error_response.external_api_called).toBe(false);
    expect(error_response.log_entry).toMatch(/日付範囲が不正/);
  });
});