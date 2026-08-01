import { calculatePast3MonthsRange } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-637
  test('月初の日付から過去3ヶ月を計算する場合、正確に計算される', () => {
    const currentDate = new Date('2024-01-01T00:00:00Z');
    const result = calculatePast3MonthsRange(currentDate);

    expect(result.startDate).toEqual(new Date('2023-10-01T00:00:00Z'));
    expect(result.endDate).toEqual(new Date('2023-12-31T23:59:59Z'));
  });
});