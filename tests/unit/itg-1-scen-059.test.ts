import { describe, test, expect } from '@jest/globals';
import { confirmDataAccumulationAndSetExtractionPeriod } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-059
  test('営業プロセスログ抽出範囲確定機能 - 営業部長のデータ蓄積量確認完了時にログ抽出対象期間が確定される', () => {
    const confirmation_completed_at = new Date('2024-06-15T10:30:00Z');
    const user_role = 'sales_director';
    const user_id = 'director_001';

    const result = confirmDataAccumulationAndSetExtractionPeriod({
      user_id: user_id,
      user_role: user_role,
      confirmation_completed_at: confirmation_completed_at,
    });

    const expected_start_date = new Date('2024-03-17T00:00:00Z');
    const expected_end_date = new Date('2024-06-15T23:59:59Z');

    expect(result.extraction_period_confirmed).toBe(true);
    expect(result.extraction_start_date).toEqual(expected_start_date);
    expect(result.extraction_end_date).toEqual(expected_end_date);
    expect(result.extraction_period_days).toBe(90);
    expect(result.status).toBe('confirmed');
  });
});