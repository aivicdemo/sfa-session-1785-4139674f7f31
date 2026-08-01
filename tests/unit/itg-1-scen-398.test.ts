import { calculateCustomerInteractionPatternAlignment } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-398
  test("顧客対応パターンレコードが複数件の場合、全件に対して合致度が計算される", () => {
    const salesPersonId = "sales_001";
    const patterns = [
      {
        id: "pattern_001",
        salesPersonId: salesPersonId,
        interactionMethod: "電話初回接触後にメール送信",
        contractedResult: "成約",
      },
      {
        id: "pattern_002",
        salesPersonId: salesPersonId,
        interactionMethod: "メール初回接触後に訪問",
        contractedResult: "成約",
      },
      {
        id: "pattern_003",
        salesPersonId: salesPersonId,
        interactionMethod: "電話初回接触後にメール送信",
        contractedResult: "未成約",
      },
    ];

    const result = calculateCustomerInteractionPatternAlignment(patterns);

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("patternId", "pattern_001");
    expect(result[0]).toHaveProperty("alignmentScore");
    expect(typeof result[0].alignmentScore).toBe("number");
    expect(result[0].alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result[0].alignmentScore).toBeLessThanOrEqual(1);

    expect(result[1]).toHaveProperty("patternId", "pattern_002");
    expect(result[1]).toHaveProperty("alignmentScore");
    expect(typeof result[1].alignmentScore).toBe("number");
    expect(result[1].alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result[1].alignmentScore).toBeLessThanOrEqual(1);

    expect(result[2]).toHaveProperty("patternId", "pattern_003");
    expect(result[2]).toHaveProperty("alignmentScore");
    expect(typeof result[2].alignmentScore).toBe("number");
    expect(result[2].alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result[2].alignmentScore).toBeLessThanOrEqual(1);
  });
});