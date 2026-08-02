import { detectDeviationPattern } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 乖離パターン検出", () => {
  // SCEN-305
  test("初回接触と提案が早く、交渉と成約が遅いとき『中盤の詰まり』パターンとして検出される", () => {
    const dealRecord = {
      initialContactDate: new Date("2024-01-01"),
      proposalDate: new Date("2024-01-05"),
      negotiationStartDate: new Date("2024-02-20"),
      closedDate: new Date("2024-03-25"),
    };

    const result = detectDeviationPattern(dealRecord);

    expect(result.patternName).toBe("MIDTERM_BOTTLENECK");
    expect(result.description).toBe(
      "交渉と成約フェーズが計34日間と遅延しており、初回接触から提案までの4日間に比べて著しく遅い"
    );
  });
});