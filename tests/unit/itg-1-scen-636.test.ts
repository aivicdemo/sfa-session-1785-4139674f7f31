import { calculatePast3MonthsPeriod } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-636
  test("[edge] 月末の日付から過去3ヶ月を計算する場合、正確に計算される", () => {
    const input_end_date = new Date("2024-03-31T00:00:00Z");
    const result = calculatePast3MonthsPeriod(input_end_date);

    const expected_start_date = new Date("2023-12-31T00:00:00Z");
    const expected_end_date = new Date("2024-03-31T00:00:00Z");

    expect(result.start_date).toEqual(expected_start_date);
    expect(result.end_date).toEqual(expected_end_date);

    const day_count =
      (result.end_date.getTime() - result.start_date.getTime()) /
      (1000 * 60 * 60 * 24);
    expect(day_count).toBe(92);
  });
});