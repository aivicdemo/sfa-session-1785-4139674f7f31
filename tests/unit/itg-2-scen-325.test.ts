import { calculateProcessDeviationScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-325
  test("標準プロセスとの乖離度がちょうど改善指導対象の閾値となる場合、改善指導対象と判定される", () => {
    const improvement_guidance_threshold = 15.0;
    const process_deviation_score = 15.0;

    const sales_record = {
      salesperson_id: "SP001",
      process_deviation_score: process_deviation_score,
    };

    const result = calculateProcessDeviationScore(
      sales_record,
      improvement_guidance_threshold
    );

    expect(result.requires_improvement_guidance).toBe(true);
  });
});