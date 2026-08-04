import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("パターン適用可能性評価機能", () => {
  // SCEN-066
  test("適用可能性スコアがちょうど1.0の場合に結果が正常に返される", () => {
    const dealCondition = {
      industry: "IT",
      projectScale: "medium",
      customerType: "new",
    };

    const evaluatedAt = "2024-01-15T11:00:00Z";

    const result = evaluatePatternRelevance(dealCondition);

    expect(result.score).toBe(1.0);
    expect(result.status).toBe("FULLY_APPLICABLE");
    expect(result.matchingReason).toBeTruthy();
    expect(typeof result.matchingReason).toBe("string");
    expect(result.matchingReason.length).toBeGreaterThan(0);
    expect(result.metadata).toBeDefined();
    expect(result.metadata.evaluatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
  });
});