import { determineSalesProcessLogExtractionPeriod } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-109
  test("[edge] 営業プロセスログデータ抽出範囲確定機能 - 抽出対象期間が月末日ちょうどで終了する場合、期間終了日が正しく確定される", () => {
    const start_date = new Date("2024-01-01T00:00:00Z");
    const end_date = new Date("2024-01-31T00:00:00Z");

    const result = determineSalesProcessLogExtractionPeriod(start_date, end_date);

    const expected_end_datetime = new Date("2024-01-31T23:59:59Z");

    expect(result.period_end_date_time).toEqual(expected_end_datetime);
  });
});