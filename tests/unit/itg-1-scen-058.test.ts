import { describe, test, expect, beforeEach } from '@jest/globals';
import { extractLogPeriodConfirmation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-058
  test('営業プロセスログ抽出範囲確定機能 - 営業部長の月次営業会議完了時にログ抽出対象期間が確定される', () => {
    const user_id = 'user_sales_director_001';
    const user_role = '営業部長';
    const meeting_completion_event = {
      event_type: 'monthly_meeting_completed',
      triggered_at: new Date('2024-01-31T14:30:00Z'),
      user_id: user_id,
    };
    const current_date = new Date('2024-01-31T14:30:00Z');

    const result = extractLogPeriodConfirmation({
      user_id: user_id,
      user_role: user_role,
      meeting_completion_event: meeting_completion_event,
      current_date: current_date,
    });

    expect(result.extraction_period_start).toBe('2024-01-01T00:00:00Z');
    expect(result.extraction_period_end).toBe('2024-01-31T23:59:59Z');
    expect(result.period_confirmation_status).toBe('確定済み');
    expect(result.confirmed_at).toBe('2024-01-31T14:30:00Z');
    expect(result.confirmed_by_user_id).toBe('user_sales_director_001');
  });
});