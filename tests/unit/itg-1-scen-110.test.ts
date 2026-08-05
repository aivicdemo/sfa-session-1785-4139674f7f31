import { determineExtractionPeriodEndDate } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-110
  test('営業プロセスログデータ抽出範囲確定機能 - 抽出対象期間が月末日の前日で終了する場合、期間終了日が正しく確定される', () => {
    const input_start_date = new Date('2024-01-01T00:00:00Z');
    const input_end_date = new Date('2024-01-30T23:59:59Z');

    const result = determineExtractionPeriodEndDate({
      start_date: input_start_date,
      end_date: input_end_date,
    });

    expect(result.confirmed_end_date).toEqual(new Date('2024-01-30T23:59:59Z'));
    expect(result.is_auto_adjusted).toBe(false);
    expect(result.confirmed_end_date.getDate()).toBe(30);
    expect(result.confirmed_end_date.getMonth()).toBe(0);
    expect(result.confirmed_end_date.getFullYear()).toBe(2024);
  });
});